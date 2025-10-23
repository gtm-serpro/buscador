// src/hooks/useSearch.ts

import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchStore } from '@/stores/searchStore';
import { searchDocuments, processFacets } from '@/services/api';
import { syncFiltersWithURL, syncURLWithFilters } from '@/utils/urlParams';

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);
  const lastSearchParams = useRef<string>('');
  
  const {
    query,
    appliedFilters,
    currentPage,
    pageSize,
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
  const executeSearch = useCallback(async () => {
    if (!query && appliedFilters.length === 0) return;

    // Previne busca duplicada comparando parâmetros
    const currentParams = `${query}-${JSON.stringify(appliedFilters)}-${currentPage}`;
    if (currentParams === lastSearchParams.current) {
      return;
    }
    lastSearchParams.current = currentParams;

    setShowCommandModal(false);
    setIsSearching(true);
    setError(null);

    try {
      const { documents, total, facets } = await searchDocuments(
        query,
        appliedFilters,
        currentPage,
        pageSize
      );

      setDocuments(documents, total);
      setGroupCounts(processFacets(facets));
      addToHistory(query, appliedFilters);

      syncURLWithFilters(setSearchParams, {
        q: query,
        filters: appliedFilters,
        page: currentPage,
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSearching(false);
    }
  }, [query, appliedFilters, currentPage, pageSize, setDocuments, setGroupCounts, setIsSearching, setError, addToHistory, setSearchParams, setShowCommandModal]);
  
  /**
   * Busca com debounce (500ms)
   */
  const debouncedSearch = useDebouncedCallback(executeSearch, 500);
  
  /**
   * Sincroniza URL com store ao carregar a página (apenas uma vez)
   */
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const urlState = syncFiltersWithURL(searchParams);
    
    if (urlState.query) setQuery(urlState.query);
    if (urlState.filters.length > 0) {
      urlState.filters.forEach(filter => addFilter(filter));
    }
    
    // Se tem query ou filtros na URL, executa busca
    if (urlState.query || urlState.filters.length > 0) {
      executeSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    search: executeSearch,
    debouncedSearch
  };
}