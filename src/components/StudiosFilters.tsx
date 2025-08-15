import MultiSelectNeighborhoods from '@/components/MultiSelectNeighborhoods';

type ViewMode = 'cards' | 'list' | 'map';

interface StudiosFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  neighborhoods: string[];
  selectedNeighborhoods: string[];
  setSelectedNeighborhoods: (value: string[]) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  hasWhatsAppOnly: boolean;
  setHasWhatsAppOnly: (value: boolean) => void;
  hasWebsiteOnly: boolean;
  setHasWebsiteOnly: (value: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  studiosCount: number;
  totalStudios: number;
  error?: string;
}

export default function StudiosFilters({
  searchTerm,
  setSearchTerm,
  neighborhoods,
  selectedNeighborhoods,
  setSelectedNeighborhoods,
  minRating,
  setMinRating,
  hasWhatsAppOnly,
  setHasWhatsAppOnly,
  hasWebsiteOnly,
  setHasWebsiteOnly,
  viewMode,
  setViewMode,
  studiosCount,
  totalStudios,
  error
}: StudiosFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Buscar estúdios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <MultiSelectNeighborhoods
            neighborhoods={neighborhoods}
            selectedNeighborhoods={selectedNeighborhoods}
            onChange={setSelectedNeighborhoods}
          />
        </div>

        <div>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Todas as avaliações</option>
            <option value={3}>3+ estrelas</option>
            <option value={4}>4+ estrelas</option>
            <option value={4.5}>4.5+ estrelas</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasWhatsAppOnly}
              onChange={(e) => setHasWhatsAppOnly(e.target.checked)}
              className="mr-2"
            />
            Apenas com WhatsApp
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasWebsiteOnly}
              onChange={(e) => setHasWebsiteOnly(e.target.checked)}
              className="mr-2"
            />
            Apenas com Site
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'cards' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'map' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mapa
          </button>
        </div>
        
        <div className="text-gray-600">
          <span>
            Mostrando <strong>{Math.min(studiosCount, totalStudios)}</strong> de <strong>{totalStudios}</strong> estúdios encontrados
          </span>
          {error && (
            <p className="text-red-600 text-sm mt-2">❌ {error}</p>
          )}
        </div>
      </div>
    </div>
  );
}