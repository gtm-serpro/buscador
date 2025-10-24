// src/pages/SearchPage.tsx

import { useState } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { useSearch } from '@/hooks/useSearch';
import { Menu, X } from 'lucide-react';
import SearchCommand from '@/components/search/SearchCommand';
import ResultsTable from '@/components/results/ResultsTable';
import Sidebar from '@/components/sidebar/Sidebar';
import EmptyState from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const { 
    showCommandModal, 
    setShowCommandModal, 
    documents, 
    hasSearched,
    isSearching 
  } = useSearchStore();
  
  const { search } = useSearch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSearch = () => {
    setShowCommandModal(true);
  };

  const handleCloseSearch = () => {
    setShowCommandModal(false);
  };

  const handleSearch = () => {
    search();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Responsivo */}
      <header className="border-b px-4 md:px-6 py-3 md:py-4 bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botão menu mobile */}
            {hasSearched && documents.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden shrink-0"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            
            <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
              Buscador de Documentos
            </h1>
          </div>
          
          {hasSearched && (
            <Button
              onClick={handleOpenSearch}
              size="sm"
              className="shrink-0"
            >
              <span className="hidden sm:inline">Nova busca</span>
              <span className="sm:hidden">Buscar</span>
            </Button>
          )}
        </div>
      </header>

      {/* Modal de Busca */}
      {showCommandModal && (
        <SearchCommand 
          onSearch={handleSearch}
          onClose={handleCloseSearch}
        />
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-h-0">
        {isSearching && (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center flex items-center">
              <Spinner/>
              <p className="text-gray-600 ml-2">Buscando documentos...</p>
            </div>
          </div>
        )}

        {!isSearching && hasSearched && documents.length > 0 && (
          <div className="flex flex-1 min-h-0 relative">
            {/* Sidebar - Desktop sempre visível, Mobile em overlay */}
            <div 
              className={`
                fixed md:relative inset-y-0 left-0 z-20 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              `}
            >
              <Sidebar />
            </div>
            
            {/* Overlay mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-10 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Tabela de resultados */}
            <div className="flex-1 min-w-0">
              <ResultsTable onNewSearch={handleOpenSearch} />
            </div>
          </div>
        )}

        {!isSearching && hasSearched && documents.length === 0 && (
          <EmptyState onOpenSearch={handleOpenSearch} />
        )}

        {!isSearching && !hasSearched && !showCommandModal && (
          <div className="flex items-center justify-center flex-1 p-4">
            <div className="text-center max-w-md">
              <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Comece sua busca
              </h2>
              <p className="text-gray-600 mb-6">
                Clique no botão abaixo para abrir o buscador
              </p>
              <Button
                onClick={handleOpenSearch}
                className="w-full sm:w-auto"
              >
                Iniciar busca
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}