// src/components/EmptyState.tsx

interface EmptyStateProps {
  onOpenSearch: () => void;
}

export default function EmptyState({ onOpenSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center px-4">
      <div className="bg-gray-100 rounded-full p-8 mb-6">
        <svg
          className="h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Nenhum resultado encontrado
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Não encontramos documentos que correspondam à sua busca. 
        Tente ajustar os filtros ou fazer uma nova pesquisa.
      </p>
      
      <button
        onClick={onOpenSearch}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg
          className="h-5 w-5"
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
        Nova busca
      </button>
    </div>
  );
}