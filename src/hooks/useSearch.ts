import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchStore } from '@/stores/searchStore';
import { searchDocuments, processFacets } from '@/services/api';
import { syncFiltersWithURL, syncURLWithFilters } from '@/utils/urlParams';

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    currentPage,
    pageSize,
    hasLoadedFromURL,
    setHasLoadedFromURL,
    setDocuments,
    setGroupCounts,
    setIsSearching,
    setError,
    addToHistory,
    setQuery,
    addFilter,
    setShowCommandModal
  } = useSearchStore();

  /**
   * Executa a busca
   */
  const executeSearch = useCallback(
    async (forcedQuery?: string) => {
      // Pega SEMPRE os valores atualizados direto do store
      const effectiveQuery = forcedQuery ?? useSearchStore.getState().query;
      const currentFilters = useSearchStore.getState().appliedFilters; // ← ADICIONE ESTA LINHA
      
      if (!effectiveQuery && currentFilters.length === 0) return;

      setShowCommandModal(false);
      setIsSearching(true);
      setError(null);

      try {
        const { documents, total, facets } = await searchDocuments(
          effectiveQuery,
          currentFilters, // ← USE currentFilters aqui
          currentPage,
          pageSize
        );

        setDocuments(documents, total);
        setGroupCounts(processFacets(facets));
        addToHistory(effectiveQuery, currentFilters); // ← E aqui

        setQuery(effectiveQuery);

        // sincroniza URL
        const currentUrl = syncFiltersWithURL(searchParams);
        const nextUrl = { q: effectiveQuery, filters: currentFilters, page: currentPage }; // ← E aqui

        if (
          currentUrl.query !== nextUrl.q ||
          JSON.stringify(currentUrl.filters) !== JSON.stringify(nextUrl.filters) ||
          currentUrl.page !== nextUrl.page
        ) {
          syncURLWithFilters(setSearchParams, nextUrl);
        }
      } catch (error) {
        console.error('Erro na busca:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsSearching(false);
      }
    },
    [
      // appliedFilters REMOVIDO daqui também ✅
      currentPage,
      pageSize,
      setDocuments,
      setGroupCounts,
      setIsSearching,
      setError,
      addToHistory,
      searchParams,
      setSearchParams,
      setShowCommandModal,
      setQuery,
    ]
  );

  const debouncedSearch = useDebouncedCallback(executeSearch, 500);

  /**
   * Carrega estado da URL apenas uma vez
   */
  useEffect(() => {
    if (hasLoadedFromURL) return;

    const urlState = syncFiltersWithURL(searchParams);

    if (urlState.query || urlState.filters.length > 0) {
      if (urlState.query) setQuery(urlState.query);
      urlState.filters.forEach((f) => addFilter(f));
      setHasLoadedFromURL(true);

      // executa busca após aplicar filtros
      setTimeout(() => executeSearch(), 0);
    } else {
      setHasLoadedFromURL(true);
    }
  }, [hasLoadedFromURL, searchParams, setQuery, addFilter, setHasLoadedFromURL, executeSearch]);

  return {
    search: executeSearch,
    debouncedSearch,
  };
}