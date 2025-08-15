#!/usr/bin/env python3
"""
Script para download de imagens dos studios de Pilates
Baixa imagens, gera nomes SEO-friendly e atualiza Supabase

Uso:
    python download-studio-images.py
    python download-studio-images.py --dry-run  # Apenas simula, não baixa
    python download-studio-images.py --limit 100  # Baixa apenas 100 imagens
"""

import os
import re
import sys
import time
import argparse
import logging
import unicodedata
from pathlib import Path
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Optional, Tuple

import requests
from supabase import create_client, Client
from tqdm import tqdm
from dotenv import load_dotenv
from PIL import Image
import hashlib

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
SUPABASE_URL = 'https://afbyaucsrjsdjwhrlbbk.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYnlhdWNzcmpzZGp3aHJsYmJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYwOTY3NSwiZXhwIjoyMDcwMTg1Njc1fQ.P5F3DU7TdVpp9ORZIra6QsmFB-F3AqvEorcT0EB6PL8'
UPLOADS_DIR = Path(r'D:\sites\pilates-sp\public\uploads\studios')
LOG_FILE = r'D:\sites\pilates-sp\download-images.log'
BATCH_SIZE = 50
MAX_RETRIES = 3
TIMEOUT = 30
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class StudioImageDownloader:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Estatísticas
        self.stats = {
            'total': 0,
            'downloaded': 0,
            'skipped': 0,
            'errors': 0
        }
        
        # Criar diretórios
        if not dry_run:
            UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
            (UPLOADS_DIR / 'thumbnails').mkdir(exist_ok=True)
            (UPLOADS_DIR / 'medium').mkdir(exist_ok=True)
            (UPLOADS_DIR / 'original').mkdir(exist_ok=True)

    def normalize_string(self, text: str) -> str:
        """Normaliza string para URL/filename amigável"""
        if not text:
            return ''
        
        # Remover acentos
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        
        # Converter para minúsculas e substituir caracteres especiais
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        text = text.strip('-')
        
        # Limitar tamanho
        return text[:50]

    def generate_seo_filename(self, studio: Dict) -> str:
        """Gera nome SEO-friendly para o arquivo"""
        try:
            # Extrair informações
            name = self.normalize_string(studio.get('title', ''))
            neighborhood = self.normalize_string(studio.get('neighborhood', ''))
            city = self.normalize_string(studio.get('city_code', ''))
            
            # Garantir que temos dados mínimos
            if not name:
                name = 'studio'
            if not neighborhood:
                neighborhood = 'centro'
            if not city:
                city = 'sp'
            
            # Formato: pilates-bairro-cidade-nome-studio (sem ID)
            filename = f'pilates-{neighborhood}-{city}-{name}'
            
            # Limitar tamanho total
            filename = filename[:100]
            
            return filename
            
        except Exception as e:
            logger.error(f"Erro ao gerar nome SEO para studio {studio.get('id')}: {e}")
            return f'pilates-studio-{studio.get('id', 'unknown')}'

    def get_file_extension(self, url: str, content_type: str = '') -> str:
        """Determina extensão do arquivo"""
        # Tentar pela URL primeiro
        parsed = urlparse(url)
        path = Path(parsed.path)
        ext = path.suffix.lower()
        
        if ext in ALLOWED_EXTENSIONS:
            return ext
        
        # Tentar pelo content-type
        if 'jpeg' in content_type or 'jpg' in content_type:
            return '.jpg'
        elif 'png' in content_type:
            return '.png'
        elif 'webp' in content_type:
            return '.webp'
        
        # Default para .jpg
        return '.jpg'

    def download_image(self, url: str, filepath: Path) -> bool:
        """Baixa uma imagem com retry e validação"""
        for attempt in range(MAX_RETRIES):
            try:
                # Fazer requisição
                response = self.session.get(
                    url, 
                    timeout=TIMEOUT,
                    stream=True
                )
                
                if response.status_code != 200:
                    logger.warning(f"Status {response.status_code} para {url}")
                    continue
                
                # Verificar content-type
                content_type = response.headers.get('content-type', '')
                if not any(img_type in content_type.lower() 
                          for img_type in ['image/', 'jpeg', 'jpg', 'png', 'webp']):
                    logger.warning(f"Content-type inválido: {content_type} para {url}")
                    continue
                
                # Verificar tamanho
                content_length = response.headers.get('content-length')
                if content_length and int(content_length) > MAX_FILE_SIZE:
                    logger.warning(f"Arquivo muito grande: {content_length} bytes para {url}")
                    continue
                
                # Baixar e salvar
                content = b''
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        content += chunk
                        if len(content) > MAX_FILE_SIZE:
                            raise ValueError("Arquivo muito grande")
                
                if len(content) < 1024:  # Muito pequeno
                    logger.warning(f"Arquivo muito pequeno: {len(content)} bytes para {url}")
                    continue
                
                # Salvar arquivo
                if not self.dry_run:
                    with open(filepath, 'wb') as f:
                        f.write(content)
                    
                    # Validar se é imagem válida
                    try:
                        with Image.open(filepath) as img:
                            img.verify()
                    except Exception as e:
                        logger.warning(f"Imagem corrompida: {e}")
                        filepath.unlink(missing_ok=True)
                        continue
                
                return True
                
            except Exception as e:
                logger.warning(f"Erro na tentativa {attempt + 1} para {url}: {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(2 ** attempt)  # Backoff exponencial
        
        return False

    def create_thumbnails(self, original_path: Path, base_name: str) -> Dict[str, str]:
        """Cria thumbnails otimizados"""
        if self.dry_run:
            return {
                'thumbnail': f'thumbnails/{base_name}.webp',
                'medium': f'medium/{base_name}.webp'
            }
        
        try:
            with Image.open(original_path) as img:
                # Converter para RGB se necessário
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Thumbnail (300x200)
                thumb = img.copy()
                thumb.thumbnail((300, 200), Image.Resampling.LANCZOS)
                thumb_path = UPLOADS_DIR / 'thumbnails' / f'{base_name}.webp'
                thumb.save(thumb_path, 'WEBP', quality=85, optimize=True)
                
                # Medium (600x400)
                medium = img.copy()
                medium.thumbnail((600, 400), Image.Resampling.LANCZOS)
                medium_path = UPLOADS_DIR / 'medium' / f'{base_name}.webp'
                medium.save(medium_path, 'WEBP', quality=90, optimize=True)
                
                return {
                    'thumbnail': f'thumbnails/{base_name}.webp',
                    'medium': f'medium/{base_name}.webp'
                }
        
        except Exception as e:
            logger.error(f"Erro ao criar thumbnails para {original_path}: {e}")
            return {}

    def get_studios_with_images(self, limit: Optional[int] = None) -> List[Dict]:
        """Busca studios que têm imagens para baixar"""
        try:
            query = self.supabase.table('studios').select('*').not_.is_('image_url', 'null').neq('image_url', '')
            
            if limit:
                query = query.limit(limit)
            
            result = query.execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Erro ao buscar studios: {e}")
            return []

    def log_download_info(self, studio_id: int, filename: str) -> bool:
        """Registra informações do download (não atualiza banco)"""
        logger.info(f"Studio {studio_id}: arquivo salvo como {filename}")
        return True

    def process_studio(self, studio: Dict) -> bool:
        """Processa um studio individual"""
        studio_id = studio.get('id')
        current_image_url = studio.get('image_url', '')
        
        if not current_image_url or current_image_url.startswith('pilates-'):
            # Já foi processado ou não tem imagem
            self.stats['skipped'] += 1
            return True
        
        # Gerar nome SEO
        base_filename = self.generate_seo_filename(studio)
        
        # Determinar extensão
        try:
            # Fazer HEAD request para pegar content-type
            head_response = self.session.head(current_image_url, timeout=10)
            content_type = head_response.headers.get('content-type', '')
        except:
            content_type = ''
        
        extension = self.get_file_extension(current_image_url, content_type)
        filename = f'{base_filename}{extension}'
        filepath = UPLOADS_DIR / 'original' / filename
        
        # Verificar se já existe
        if filepath.exists() and not self.dry_run:
            logger.info(f"Arquivo já existe: {filename}")
            self.stats['skipped'] += 1
            return True
        
        # Baixar imagem
        logger.info(f"Baixando {studio.get('title', 'Unknown')} -> {filename}")
        
        if not self.download_image(current_image_url, filepath):
            logger.error(f"Falha ao baixar imagem para studio {studio_id}")
            self.stats['errors'] += 1
            return False
        
        # Criar thumbnails
        thumbnails = self.create_thumbnails(filepath, base_filename)
        
        # Registrar download (não atualiza banco)
        self.log_download_info(studio_id, filename)
        self.stats['downloaded'] += 1
        logger.info(f"✓ Sucesso: {filename}")
        return True

    def run(self, limit: Optional[int] = None):
        """Executa o processo completo"""
        logger.info("=== Iniciando download de imagens dos studios ===")
        logger.info(f"Modo: {'DRY RUN' if self.dry_run else 'PRODUÇÃO'}")
        
        # Buscar studios
        logger.info("Buscando studios com imagens...")
        studios = self.get_studios_with_images(limit)
        
        if not studios:
            logger.warning("Nenhum studio encontrado!")
            return
        
        self.stats['total'] = len(studios)
        logger.info(f"Encontrados {len(studios)} studios para processar")
        
        # Processar em batches
        with tqdm(total=len(studios), desc="Processando studios") as pbar:
            for i in range(0, len(studios), BATCH_SIZE):
                batch = studios[i:i + BATCH_SIZE]
                
                for studio in batch:
                    self.process_studio(studio)
                    pbar.update(1)
                    time.sleep(0.1)  # Rate limiting
        
        # Relatório final
        self.print_summary()

    def print_summary(self):
        """Imprime resumo da execução"""
        logger.info("\n" + "="*50)
        logger.info("RESUMO DA EXECUÇÃO")
        logger.info("="*50)
        logger.info(f"Total de studios: {self.stats['total']}")
        logger.info(f"Imagens baixadas: {self.stats['downloaded']}")
        logger.info(f"Skipped: {self.stats['skipped']}")
        logger.info(f"Erros: {self.stats['errors']}")
        logger.info("="*50)
        
        if self.stats['downloaded'] > 0:
            logger.info(f"✓ Imagens salvas em: {UPLOADS_DIR}")
            logger.info("✓ Thumbnails criados automaticamente")
            logger.info("✓ URLs serão geradas dinamicamente pelo sistema")

def main():
    parser = argparse.ArgumentParser(description='Download de imagens dos studios')
    parser.add_argument('--dry-run', action='store_true', help='Simula execução sem baixar')
    parser.add_argument('--limit', type=int, help='Limite de studios para processar')
    
    args = parser.parse_args()
    
    # Executar
    downloader = StudioImageDownloader(dry_run=args.dry_run)
    downloader.run(limit=args.limit)

if __name__ == '__main__':
    main()