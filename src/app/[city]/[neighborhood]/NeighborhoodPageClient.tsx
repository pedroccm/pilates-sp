import StudiosPage from '@/components/StudiosPage';

interface NeighborhoodPageClientProps {
  cityCode: string;
  neighborhoodName: string;
}

export default function NeighborhoodPageClient({ 
  cityCode, 
  neighborhoodName 
}: NeighborhoodPageClientProps) {
  return (
    <StudiosPage 
      cityCode={cityCode} 
      preSelectedNeighborhood={neighborhoodName}
    />
  );
}