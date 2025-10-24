// src/components/search/SearchCommand/index.tsx

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/stores/searchStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SelectedFilters from './SelectedFilters';
import FilterSection from './FilterSection';

interface SearchCommandProps {
  onSearch: (term: string) => void;
  onClose: () => void;
}

export default function SearchCommand({ onSearch, onClose }: SearchCommandProps) {
  const { query, setQuery } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = () => {
    setQuery(localQuery);
    onSearch(localQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-4 md:pt-20 z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] md:max-h-[85vh] flex flex-col">
        {/* Header com Input de Busca */}
        <div className="p-3 md:p-4 bg-blue-700 border-b rounded-t-lg">
          <div className="relative mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Digite o texto para buscar nos documentos..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white pl-10 pr-9 h-11 md:h-12 text-sm md:text-base border border-blue-400/30 focus:border-blue-500 rounded-lg shadow-sm focus:shadow-md transition-all"
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Digite o texto para buscar nos documentos..."}
            />
            {localQuery && (
              <button
                onClick={() => setLocalQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filtros Selecionados */}
        <SelectedFilters />

        {/* Título dos Filtros */}
        <div className="px-3 md:px-4 py-2 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">
            Filtros Disponíveis
          </h3>
          <p className="text-xs text-gray-500 hidden md:block">
            Selecione os filtros para refinar sua busca
          </p>
        </div>

        {/* Lista de Filtros - Scroll */}
        <div className="overflow-auto flex-1 min-h-0">
          <FilterSection />
        </div>

        {/* Footer com Botões */}
        <div className="border-t p-3 md:p-4 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="text-xs md:text-sm text-gray-600 text-center md:text-left hidden md:block">
              <span className="font-medium">Dica:</span> Combine a busca de texto com filtros para resultados mais precisos
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="flex-1 md:flex-none"
              >
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleSearch}
                className="flex-1 md:flex-none"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}