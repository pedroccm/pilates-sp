const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Você precisa definir essas variáveis com suas credenciais do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key para insert

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Defina as variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createUniqueSlug(title, existingSlugs = []) {
  const baseSlug = generateSlug(title);
  let finalSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

async function migrateData() {
  console.log('🚀 Iniciando migração dos dados para Supabase...');
  
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const cities = {
    'sp': 'pilates-sp.json',
    'rj': 'pilates-rj.json',
    'bh': 'pilates-bh.json',
    'bsb': 'pilates-bsb.json',
    'cwb': 'pilates-cwb.json'
  };

  let totalInserted = 0;
  let allSlugs = [];

  for (const [cityCode, fileName] of Object.entries(cities)) {
    console.log(`📁 Processando ${cityCode.toUpperCase()} - ${fileName}...`);
    
    try {
      const filePath = path.join(dataDir, fileName);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const studios = JSON.parse(rawData);
      
      console.log(`   Encontrados ${studios.length} estúdios`);
      
      // Prepare data for insertion
      const studiosToInsert = studios.map((studio, index) => {
        const uniqueSlug = createUniqueSlug(studio.title, allSlugs);
        allSlugs.push(uniqueSlug);
        
        return {
          title: studio.title || 'Studio sem nome',
          total_score: studio.totalScore != null ? studio.totalScore : 0,
          reviews_count: studio.reviewsCount || 0,
          street: studio.street || '',
          postal_code: studio.postalCode || null,
          neighborhood: studio.neighborhood || 'Não informado',
          state: studio.state || 'SP',
          phone: studio.phone || '',
          category_name: studio.categoryName || 'Studio',
          url: studio.url || '',
          image_url: studio.imageUrl || '',
          website: studio.website || null,
          opening_hours: studio.openingHours || [],
          location: studio.location || { lat: 0, lng: 0 },
          address: studio.address || '',
          city_code: cityCode,
          slug: uniqueSlug
        };
      });

      // Insert in batches of 100 to avoid timeouts
      const batchSize = 100;
      for (let i = 0; i < studiosToInsert.length; i += batchSize) {
        const batch = studiosToInsert.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('studios')
          .insert(batch);

        if (error) {
          console.error(`❌ Erro ao inserir batch ${i / batchSize + 1} de ${cityCode}:`, error);
          throw error;
        }
        
        console.log(`   ✅ Inserido batch ${i / batchSize + 1}/${Math.ceil(studiosToInsert.length / batchSize)} (${batch.length} registros)`);
      }
      
      totalInserted += studiosToInsert.length;
      console.log(`✅ ${cityCode.toUpperCase()} concluída: ${studiosToInsert.length} estúdios inseridos`);
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${cityCode}:`, error);
      throw error;
    }
  }

  console.log(`🎉 Migração concluída! Total de ${totalInserted} estúdios inseridos no Supabase.`);
  
  // Verificar se os dados foram inseridos corretamente
  const { count, error } = await supabase
    .from('studios')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('❌ Erro ao verificar dados inseridos:', error);
  } else {
    console.log(`✅ Verificação: ${count} registros encontrados no banco de dados.`);
  }
}

// Run migration
migrateData().catch(console.error);