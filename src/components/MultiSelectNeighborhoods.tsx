'use client';

import { useState, useRef, useEffect } from 'react';

interface MultiSelectNeighborhoodsProps {
  neighborhoods: string[];
  selectedNeighborhoods: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelectNeighborhoods({ 
  neighborhoods = [], 
  selectedNeighborhoods = [], 
  onChange 
}: MultiSelectNeighborhoodsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood && typeof neighborhood === 'string' && neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (neighborhood: string) => {
    if (selectedNeighborhoods.includes(neighborhood)) {
      onChange(selectedNeighborhoods.filter(n => n !== neighborhood));
    } else {
      onChange([...selectedNeighborhoods, neighborhood]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange([...neighborhoods]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (selectedNeighborhoods.length === 0) {
      return 'Todos os bairros';
    }
    if (selectedNeighborhoods.length === 1) {
      return selectedNeighborhoods[0];
    }
    return `${selectedNeighborhoods.length} bairros selecionados`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
      >
        <span className={selectedNeighborhoods.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {getDisplayText()}
        </span>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar bairros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="p-2 border-b border-gray-200 flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Selecionar todos
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Limpar seleção
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredNeighborhoods.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm text-center">
                Nenhum bairro encontrado
              </div>
            ) : (
              filteredNeighborhoods.map((neighborhood) => (
                <label
                  key={neighborhood}
                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedNeighborhoods.includes(neighborhood)}
                    onChange={() => handleToggle(neighborhood)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{neighborhood}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}