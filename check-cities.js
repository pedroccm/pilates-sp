require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCities() {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('city_code')
      .neq('city_code', null);
      
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    const uniqueCities = [...new Set(data.map(studio => studio.city_code))];
    console.log('Cidades com estúdios cadastrados:', uniqueCities.sort());
    console.log('Total de cidades:', uniqueCities.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCities();