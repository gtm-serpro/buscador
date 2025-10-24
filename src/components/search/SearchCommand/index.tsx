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
    onSearch(localQuery); // <-- passa o termo diretamente
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[85vh] flex flex-col">
        {/* Header com Input de Busca */}
        <div className="p-4 bg-blue-500 border-b rounded-t-lg">
        <div className="relative  mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5 pointer-events-none " />
          <Input
            type="text"
            placeholder="Digite o texto para buscar nos documentos..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white pl-10 pr-9 h-12 text-base border border-blue-400/30 focus:border-blue-500 rounded-lg shadow-sm focus:shadow-md transition-all"
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
        <div className="px-4 py-2 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">
            Filtros Disponíveis
          </h3>
          <p className="text-xs text-gray-500">
            Selecione os filtros para refinar sua busca
          </p>
        </div>

        {/* Lista de Filtros Disponíveis */}
        <div className="overflow-auto max-h-[calc(85vh-250px)]">
          <FilterSection />
        </div>

        {/* Footer com Botões */}
        <div className="bborder-t p-4 flex justify-between items-center bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Dica:</span> Combine a busca de texto com filtros para resultados mais precisos
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}