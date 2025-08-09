import { supabase } from './supabase'
import { Studio } from '@/types/studio'

interface AnalyticsData {
  totalStudios: number;
  studiosByNeighborhood: { [key: string]: number };
  studiosWithWebsite: number;
  studiosWithInstagram: number;
  studiosWithWhatsApp: number;
  studiosWithPhone: number;
  averageRating: number;
  totalReviews: number;
  topRatedStudios: Studio[];
  mostReviewedStudios: Studio[];
}

// Convert database format to frontend Studio type
function dbStudioToStudio(dbStudio: any): Studio {
  return {
    title: dbStudio.title,
    totalScore: dbStudio.total_score,
    reviewsCount: dbStudio.reviews_count,
    street: dbStudio.street,
    postalCode: dbStudio.postal_code,
    neighborhood: dbStudio.neighborhood,
    state: dbStudio.state,
    phone: dbStudio.phone,
    categoryName: dbStudio.category_name,
    url: dbStudio.url,
    imageUrl: dbStudio.image_url,
    website: dbStudio.website,
    websiteUrl: dbStudio.website,
    instagramUrl: dbStudio.instagram_url,
    openingHours: dbStudio.opening_hours || [],
    location: dbStudio.location,
    address: dbStudio.address,
    city: dbStudio.city_code,
    slug: dbStudio.slug,
    uniqueId: dbStudio.id
  }
}

export async function getAllStudiosForAnalytics(cityCode?: string): Promise<Studio[]> {
  try {
    console.log('🔄 Carregando todos os estúdios para analytics...');
    
    let allStudios: any[] = [];
    let from = 0;
    const batchSize = 1000; // Máximo do Supabase
    let hasMore = true;

    while (hasMore) {
      console.log(`📄 Carregando batch ${Math.floor(from / batchSize) + 1} (${from} - ${from + batchSize - 1})...`);
      
      let query = supabase
        .from('studios')
        .select('*')
        .range(from, from + batchSize - 1)
        .order('title');

      if (cityCode && cityCode !== 'geral') {
        query = query.eq('city_code', cityCode);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching studios batch:', error);
        throw new Error(`Failed to fetch studios: ${error.message}`);
      }

      if (data && data.length > 0) {
        allStudios = [...allStudios, ...data];
        from += batchSize;
        
        // Se recebeu menos que batchSize, acabaram os dados
        hasMore = data.length === batchSize;
        
        console.log(`✅ Batch carregado. Total atual: ${allStudios.length} estúdios`);
      } else {
        hasMore = false;
      }
    }

    console.log(`🎉 Analytics completo! Total de ${allStudios.length} estúdios carregados`);
    return allStudios.map(dbStudioToStudio);
  } catch (error) {
    console.error('Error in getAllStudiosForAnalytics:', error);
    throw error;
  }
}

export async function calculateAnalytics(cityCode: string = 'geral'): Promise<AnalyticsData> {
  try {
    const studios = await getAllStudiosForAnalytics(cityCode);

    const studiosByNeighborhood = studios.reduce((acc, studio) => {
      const neighborhood = studio.neighborhood || 'Não informado';
      acc[neighborhood] = (acc[neighborhood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Website: verifica se tem website
    const studiosWithWebsite = studios.filter(studio => 
      studio.website && studio.website.trim() !== ''
    ).length;

    // Instagram: verifica se a URL do website contém instagram
    const studiosWithInstagram = studios.filter(studio => 
      studio.website && studio.website.toLowerCase().includes('instagram')
    ).length;

    // WhatsApp: verifica se o telefone parece ser WhatsApp (padrão brasileiro)
    const studiosWithWhatsApp = studios.filter(studio => 
      studio.phone && /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(studio.phone)
    ).length;

    // Phone: qualquer telefone não vazio
    const studiosWithPhone = studios.filter(studio => 
      studio.phone && studio.phone.trim() !== ''
    ).length;

    const validScores = studios.filter(studio => studio.totalScore > 0);
    const averageRating = validScores.length > 0 
      ? validScores.reduce((sum, studio) => sum + studio.totalScore, 0) / validScores.length 
      : 0;

    const totalReviews = studios.reduce((sum, studio) => sum + (studio.reviewsCount || 0), 0);

    // Top 10 mais bem avaliados (com pelo menos 1 review)
    const topRatedStudios = studios
      .filter(studio => studio.totalScore > 0 && studio.reviewsCount > 0)
      .sort((a, b) => {
        // Primeiro por nota, depois por número de reviews
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        return b.reviewsCount - a.reviewsCount;
      })
      .slice(0, 10);

    // Top 10 com mais reviews
    const mostReviewedStudios = studios
      .filter(studio => studio.reviewsCount > 0)
      .sort((a, b) => b.reviewsCount - a.reviewsCount)
      .slice(0, 10);

    return {
      totalStudios: studios.length,
      studiosByNeighborhood,
      studiosWithWebsite,
      studiosWithInstagram,
      studiosWithWhatsApp,
      studiosWithPhone,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      topRatedStudios,
      mostReviewedStudios
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    throw error;
  }
}

// Get city statistics with direct SQL for better performance
export async function getCityStatsSQL() {
  try {
    const { data, error } = await supabase.rpc('get_city_stats');
    
    if (error) {
      console.error('Error getting city stats:', error);
      // Fallback to manual calculation
      return await getCityStatsFallback();
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCityStatsSQL:', error);
    return await getCityStatsFallback();
  }
}

async function getCityStatsFallback() {
  const { data, error } = await supabase
    .from('studios')
    .select('city_code, total_score, reviews_count');

  if (error) throw error;

  const statsByCity = data.reduce((acc: any, studio: any) => {
    const city = studio.city_code;
    if (!acc[city]) {
      acc[city] = {
        city_code: city,
        total_studios: 0,
        avg_rating: 0,
        total_reviews: 0,
        sum_ratings: 0,
        valid_ratings: 0
      };
    }
    
    acc[city].total_studios++;
    acc[city].total_reviews += studio.reviews_count || 0;
    
    if (studio.total_score > 0) {
      acc[city].sum_ratings += studio.total_score;
      acc[city].valid_ratings++;
    }
    
    return acc;
  }, {});

  // Calculate averages
  Object.keys(statsByCity).forEach(city => {
    const stats = statsByCity[city];
    stats.avg_rating = stats.valid_ratings > 0 
      ? Math.round((stats.sum_ratings / stats.valid_ratings) * 10) / 10
      : 0;
    delete stats.sum_ratings;
    delete stats.valid_ratings;
  });

  return Object.values(statsByCity);
}

export async function getStudiosWithInstagram(cityCode: string = 'geral'): Promise<Studio[]> {
  try {
    const studios = await getAllStudiosForAnalytics(cityCode);
    return studios.filter(studio => 
      studio.website && studio.website.toLowerCase().includes('instagram')
    );
  } catch (error) {
    console.error('Error getting studios with Instagram:', error);
    throw error;
  }
}