// src/components/results/ResultsTable/index.tsx

import { useState } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { useSearch } from '@/hooks/useSearch';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';

interface ResultsTableProps {
  onNewSearch: () => void;
}

export default function ResultsTable({ onNewSearch }: ResultsTableProps) {
  const { documents, totalDocuments, currentPage, pageSize, setCurrentPage } = useSearchStore();
  const { search } = useSearch();
  const [localFilter, setLocalFilter] = useState('');

  const totalPages = Math.ceil(totalDocuments / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search();
  };

  // Filtra documentos localmente
  const filteredDocuments = localFilter.trim()
    ? documents.filter(doc => {
        const searchTerm = localFilter.toLowerCase();
        return (
          doc.titulo_s?.toLowerCase().includes(searchTerm) ||
          doc.processo_s?.toLowerCase().includes(searchTerm) ||
          doc.tipo_processo_s?.toLowerCase().includes(searchTerm) ||
          doc.nome_contribuinte_s?.toLowerCase().includes(searchTerm) ||
          doc.ni_contribuinte_s?.toLowerCase().includes(searchTerm) ||
          doc.situacao_s?.toLowerCase().includes(searchTerm)
        );
      })
    : documents;

  const clearLocalFilter = () => {
    setLocalFilter('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {totalDocuments.toLocaleString('pt-BR')} documento{totalDocuments !== 1 ? 's' : ''} encontrado{totalDocuments !== 1 ? 's' : ''}
          </h2>
          <Button  size="sm" onClick={onNewSearch}>
            <Search className="h-4 w-4 mr-2" />
            Nova busca
          </Button>
        </div>

        {/* Filtro Local */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Filtrar resultados exibidos..."
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            className="pl-10 pr-10"
          />
          {localFilter && (
            <button
              onClick={clearLocalFilter}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {localFilter && (
          <div className="text-sm text-gray-600">
            Mostrando {filteredDocuments.length} de {documents.length} resultados
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto">
        {filteredDocuments.length > 0 ? (
          <table className="w-full">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  document={doc}
                  highlightTerm={localFilter}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum resultado corresponde ao filtro
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar o termo de busca
            </p>
            <Button variant="outline" size="sm" onClick={clearLocalFilter}>
              Limpar filtro
            </Button>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && !localFilter && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalDocuments}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}