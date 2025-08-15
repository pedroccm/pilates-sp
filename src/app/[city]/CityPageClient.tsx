import StudiosPage from '@/components/StudiosPage';

interface CityPageClientProps {
  cityCode: string;
}

export default function CityPageClient({ cityCode }: CityPageClientProps) {
  return <StudiosPage cityCode={cityCode} />;
}