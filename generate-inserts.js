const fs = require('fs');
const path = require('path');

// Função para gerar slug único
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove acentos
    .replace(/[^\w\s-]/g, "")        // Remove caracteres especiais
    .replace(/\s+/g, "-")            // Substitui espaços por hífens
    .replace(/-+/g, "-")             // Remove hífens duplicados
    .replace(/^-|-$/g, "");          // Remove hífens do início/fim
}

// Função para escapar strings SQL
function escapeSql(str) {
  if (!str) return null;
  return str.replace(/'/g, "''");
}

// Função para determinar city_code baseado no nome do arquivo
function getCityCode(filename, city) {
  const fileBasename = path.basename(filename, '.json');
  
  // Mapear alguns casos específicos
  const cityMap = {
    'belem': 'belem',
    'campinas': 'campinas', 
    'campo-grande': 'campo-grande',
    'duque-de-caxias': 'duque-de-caxias',
    'fortaleza': 'fortaleza',
    'goiania': 'goiania',
    'guarulhos': 'guarulhos',
    'maceio': 'maceio',
    'manaus': 'manaus',
    'piracicaba': 'piracicaba',
    'porto-alegre': 'porto-alegre',
    'recife': 'recife',
    'sorocaba': 'sorocaba'
  };
  
  return cityMap[fileBasename] || fileBasename;
}

// Função principal
async function generateInserts() {
  const jsonDir = 'D:\\sites\\pilates-sp\\json\\novos';
  const outputFile = 'D:\\sites\\pilates-sp\\inserts-studios.sql';
  
  let sqlStatements = [];
  let slugSet = new Set(); // Para evitar slugs duplicados
  let insertCount = 0;
  
  // Header do arquivo SQL
  sqlStatements.push('-- INSERTs para tabela studios');
  sqlStatements.push('-- Gerado automaticamente em ' + new Date().toISOString());
  sqlStatements.push('');
  
  try {
    const files = fs.readdirSync(jsonDir).filter(file => file.endsWith('.json'));
    console.log(`Encontrados ${files.length} arquivos JSON`);
    
    for (const file of files) {
      const filePath = path.join(jsonDir, file);
      console.log(`Processando: ${file}`);
      
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const cityCode = getCityCode(file);
      
      if (!Array.isArray(jsonData)) {
        console.log(`Aviso: ${file} não contém um array, pulando...`);
        continue;
      }
      
      for (const studio of jsonData) {
        try {
          // Gerar slug único
          let baseSlug = generateSlug(studio.title);
          let slug = baseSlug;
          let counter = 1;
          
          while (slugSet.has(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
          slugSet.add(slug);
          
          // Preparar valores
          const title = escapeSql(studio.title);
          const totalScore = studio.totalScore || 0;
          const reviewsCount = studio.reviewsCount || 0;
          const street = studio.street ? escapeSql(studio.street) : null;
          const postalCode = studio.postalCode ? escapeSql(studio.postalCode) : null;
          const neighborhood = studio.neighborhood ? escapeSql(studio.neighborhood) : null;
          const state = studio.state ? escapeSql(studio.state) : null;
          const phone = studio.phone ? escapeSql(studio.phone) : null;
          const categoryName = studio.categoryName ? escapeSql(studio.categoryName) : null;
          const url = studio.url ? escapeSql(studio.url) : null;
          const imageUrl = studio.imageUrl ? escapeSql(studio.imageUrl) : 'https://via.placeholder.com/400x300?text=Pilates+Studio';
          const website = studio.website ? escapeSql(studio.website) : null;
          const openingHours = JSON.stringify(studio.openingHours || []);
          const location = JSON.stringify(studio.location || {});
          const address = studio.address ? escapeSql(studio.address) : null;
          
          // Gerar INSERT
          const insert = `INSERT INTO public.studios (
    title, total_score, reviews_count, street, postal_code, neighborhood, 
    state, phone, category_name, url, image_url, website, opening_hours, 
    location, address, city_code, slug
) VALUES (
    '${title}', ${totalScore}, ${reviewsCount}, 
    ${street ? `'${street}'` : 'NULL'}, 
    ${postalCode ? `'${postalCode}'` : 'NULL'}, 
    '${neighborhood}', 
    ${state ? `'${state}'` : 'NULL'}, 
    ${phone ? `'${phone}'` : 'NULL'}, 
    ${categoryName ? `'${categoryName}'` : 'NULL'}, 
    ${url ? `'${url}'` : 'NULL'}, 
    '${imageUrl}', 
    ${website ? `'${website}'` : 'NULL'}, 
    '${openingHours.replace(/'/g, "''")}', 
    '${location.replace(/'/g, "''")}', 
    ${address ? `'${address}'` : 'NULL'}, 
    '${cityCode}', 
    '${slug}'
);`;
          
          sqlStatements.push(insert);
          sqlStatements.push('');
          insertCount++;
          
        } catch (error) {
          console.error(`Erro ao processar estúdio em ${file}:`, error.message);
          console.error('Dados do estúdio:', JSON.stringify(studio, null, 2));
        }
      }
    }
    
    // Footer
    sqlStatements.push(`-- Total de ${insertCount} estúdios inseridos`);
    
    // Escrever arquivo
    fs.writeFileSync(outputFile, sqlStatements.join('\n'), 'utf8');
    console.log(`✅ Arquivo SQL gerado: ${outputFile}`);
    console.log(`📊 Total de ${insertCount} INSERTs criados`);
    console.log(`🏙️ Cidades processadas: ${files.map(f => getCityCode(f)).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar INSERTs:', error);
  }
}

// Executar
generateInserts();