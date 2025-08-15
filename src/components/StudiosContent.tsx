import GoogleMap from '@/components/GoogleMap';
import HomeStudioCard from '@/components/HomeStudioCard';
import HomeStudioListItem from '@/components/HomeStudioListItem';
import { Studio } from '@/types/studio';

type ViewMode = 'cards' | 'list' | 'map';

interface StudiosContentProps {
  viewMode: ViewMode;
  studios: Studio[];
  hasMore: boolean;
  loadingMore: boolean;
  totalStudios: number;
  loadMore: () => void;
}

export default function StudiosContent({
  viewMode,
  studios,
  hasMore,
  loadingMore,
  totalStudios,
  loadMore
}: StudiosContentProps) {
  if (viewMode === 'map') {
    return (
      <div className="h-[600px]">
        <GoogleMap studios={studios} />
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div>
        {studios.map((studio) => (
          <HomeStudioListItem key={studio.uniqueId || studio.slug} studio={studio} />
        ))}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loadingMore ? 'Carregando...' : `Carregar mais (${totalStudios - studios.length} restantes)`}
            </button>
          </div>
        )}
      </div>
    );
  }

  // cards mode
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studios.map((studio) => (
          <HomeStudioCard key={studio.uniqueId || studio.slug} studio={studio} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Carregando...' : `Carregar mais (${totalStudios - studios.length} restantes)`}
          </button>
        </div>
      )}
    </div>
  );
}