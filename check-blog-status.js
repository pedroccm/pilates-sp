const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://afbyaucsrjsdjwhrlbbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYnlhdWNzcmpzZGp3aHJsYmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDk2NzUsImV4cCI6MjA3MDE4NTY3NX0.6u3abWJHHe86hsL8pajkJbSN7X5egpT9UJooEh3mXe8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogStatus() {
  try {
    // Buscar posts atuais
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, content_file')
      .order('slug');

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('📄 Status atual dos posts:');
    posts.forEach(post => {
      console.log(`  ${post.slug}: "${post.content_file}"`);
    });

    // Verificar se os arquivos MDX existem
    const fs = require('fs');
    const path = require('path');
    const contentDir = path.join(__dirname, 'content', 'blog');
    
    console.log('\n📁 Arquivos MDX disponíveis:');
    if (fs.existsSync(contentDir)) {
      const mdxFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));
      mdxFiles.forEach(file => console.log(`  - ${file}`));
      
      console.log('\n🔍 Verificando correspondências:');
      posts.forEach(post => {
        const fileExists = fs.existsSync(path.join(contentDir, post.content_file));
        const status = fileExists ? '✅' : '❌';
        console.log(`  ${status} ${post.slug} → ${post.content_file}`);
      });
    } else {
      console.log('❌ Pasta content/blog não encontrada');
    }

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

checkBlogStatus();