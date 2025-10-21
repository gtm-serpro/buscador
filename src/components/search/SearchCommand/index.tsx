// src/components/search/SearchCommand/index.tsx

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/stores/searchStore';
import { Command, CommandInput } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import SelectedFilters from './SelectedFilters';
import FilterSection from './FilterSection';

interface SearchCommandProps {
  onSearch: () => void;
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
    onSearch();
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
        <Command className="rounded-lg border-0">
          {/* Header com Input */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Buscar documentos..." 
              value={localQuery}
              onValueChange={setLocalQuery}
              onKeyDown={handleKeyDown}
              className="border-0 focus:ring-0"
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filtros Selecionados */}
          <SelectedFilters />

          {/* Lista de Filtros Disponíveis */}
          <div className="overflow-auto max-h-[calc(85vh-200px)]">
            <FilterSection />
          </div>

          {/* Footer com Botões */}
          <div className="border-t p-3 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-600">
              Use os filtros acima para refinar sua busca
            </span>
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
        </Command>
      </div>
    </div>
  );
}