// src/pages/SearchPage.tsx

import { useSearchStore } from '@/stores/searchStore';
import { useSearch } from '@/hooks/useSearch';
import SearchCommand from '@/components/search/SearchCommand';
import ResultsTable from '@/components/results/ResultsTable';
import Sidebar from '@/components/sidebar/Sidebar';
import EmptyState from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';

export default function SearchPage() {
  const { 
    showCommandModal, 
    setShowCommandModal, 
    documents, 
    hasSearched,
    isSearching 
  } = useSearchStore();
  
  const { search } = useSearch();

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Buscador de Documentos e-Processo
          </h1>
          
          {hasSearched && (
            <button
              onClick={handleOpenSearch}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Nova busca
            </button>
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
      <main>
        {isSearching && (
          <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="text-center flex items-center">
              <Spinner/>
              <p className="text-gray-600 ml-2">Buscando documentos...</p>
            </div>
          </div>
        )}

        {!isSearching && hasSearched && documents.length > 0 && (
          <div className="flex">
            <Sidebar />
            <ResultsTable onNewSearch={handleOpenSearch} />
          </div>
        )}

        {!isSearching && hasSearched && documents.length === 0 && (
          <EmptyState onOpenSearch={handleOpenSearch} />
        )}

        {!isSearching && !hasSearched && !showCommandModal && (
          <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="text-center">
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
              <button
                onClick={handleOpenSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar busca
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}