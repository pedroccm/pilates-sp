interface StudiosLoadingProps {
  cityName: string;
}

export default function StudiosLoading({ cityName }: StudiosLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Carregando estúdios...</h2>
          <p className="text-gray-500">Encontrando os melhores estúdios de Pilates em {cityName}</p>
        </div>
      </div>
    </div>
  );
}