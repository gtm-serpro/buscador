// src/components/results/ResultsTable/index.tsx

import { useSearchStore } from '@/stores/searchStore';
import { useSearch } from '@/hooks/useSearch';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';

interface ResultsTableProps {
  onNewSearch: () => void;
}

export default function ResultsTable({ onNewSearch }: ResultsTableProps) {
  const { documents, totalDocuments, currentPage, pageSize, setCurrentPage } = useSearchStore();
  const { search } = useSearch();

  const totalPages = Math.ceil(totalDocuments / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search(); // Busca novamente com a nova página
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <h2 className="text-xl font-semibold text-gray-800">
          {totalDocuments.toLocaleString('pt-BR')} documento{totalDocuments !== 1 ? 's' : ''} encontrado{totalDocuments !== 1 ? 's' : ''}
        </h2>
        <Button variant="outline" size="sm" onClick={onNewSearch}>
          <Search className="h-4 w-4 mr-2" />
          Nova busca
        </Button>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <TableRow key={doc.id} document={doc} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
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