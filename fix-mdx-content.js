// Script para corrigir os content_files dos posts do blog
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (usando service role key para escrita)
const supabaseUrl = 'https://afbyaucsrjsdjwhrlbbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYnlhdWNzcmpzZGp3aHJsYmJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYwOTY3NSwiZXhwIjoyMDcwMTg1Njc1fQ.P5F3DU7TdVpp9ORZIra6QsmFB-F3AqvEorcT0EB6PL8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento correto de slug para arquivo MDX
const contentFileMap = {
  '10-beneficios-pilates-comprovados-ciencia': 'beneficios-pilates-ciencia.mdx',
  'como-escolher-melhor-estudio-pilates-12-dicas-essenciais': 'como-escolher-studio-pilates.mdx', 
  'pilates-gravidez-beneficios-cuidados-exercicios-seguros': 'pilates-gravidez-beneficios-cuidados.mdx',
  'pilates-mat-vs-reformer-diferencas-vantagens-escolher': 'pilates-solo-vs-aparelhos.mdx',
  'pilates-vs-yoga-qual-escolher-diferencas-beneficios': 'pilates-vs-musculacao.mdx',
  'precos-pilates-2025-guia-completo-cidade': 'pilates-iniciantes-guia-completo-2025.mdx',
  'melhores-estudios-pilates-sao-paulo-regiao-2025': 'melhores-exercicios-pilates-postura.mdx'
};

async function fixContentFiles() {
  try {
    console.log('🔍 Buscando posts do blog...');
    
    // Buscar todos os posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content_file')
      .order('slug');

    if (error) {
      console.error('❌ Erro ao buscar posts:', error);
      return;
    }

    console.log(`📄 Encontrados ${posts.length} posts:`);
    posts.forEach(post => {
      console.log(`  - ${post.slug}: "${post.content_file || 'NULL'}"`);
    });

    console.log('\n🔧 Corrigindo content_files...');

    // Atualizar cada post
    for (const post of posts) {
      const correctFile = contentFileMap[post.slug];
      
      if (correctFile && post.content_file !== correctFile) {
        console.log(`📝 ${post.slug}: "${post.content_file}" → "${correctFile}"`);
        
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ content_file: correctFile })
          .eq('id', post.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar ${post.slug}:`, updateError);
        } else {
          console.log(`✅ ${post.slug} atualizado!`);
        }
      } else if (correctFile) {
        console.log(`✅ ${post.slug} já está correto`);
      } else {
        // Para posts sem mapeamento específico, usar arquivo padrão
        const defaultFile = 'pilates-idosos-exercicios-seguros.mdx';
        if (!post.content_file) {
          console.log(`📝 ${post.slug}: definindo arquivo padrão "${defaultFile}"`);
          
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ content_file: defaultFile })
            .eq('id', post.id);

          if (!updateError) {
            console.log(`✅ ${post.slug} definido com arquivo padrão`);
          }
        }
      }
    }

    console.log('\n🎉 Processamento concluído!');
    console.log('\n📋 Verificação final...');
    
    // Verificar resultado
    const { data: updatedPosts } = await supabase
      .from('blog_posts')
      .select('slug, content_file')
      .order('slug');

    updatedPosts?.forEach(post => {
      console.log(`  ✅ ${post.slug}: "${post.content_file}"`);
    });

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

// Executar correção
fixContentFiles();