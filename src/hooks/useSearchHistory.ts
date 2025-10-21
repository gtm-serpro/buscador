// src/hooks/useSearchHistory.ts

import { useSearchStore } from '@/stores/searchStore';

export function useSearchHistory() {
  const { searchHistory, addToHistory, clearHistory } = useSearchStore();

  /**
   * Aplica uma busca do histórico
   */
  const applyHistoryItem = (index: number) => {
    const item = searchHistory[index];
    if (!item) return;

    const { setQuery, appliedFilters, addFilter } = useSearchStore.getState();
    
    // Limpa filtros atuais
    appliedFilters.forEach(f => {
      useSearchStore.getState().removeFilter(f.id);
    });
    
    // Aplica query e filtros do histórico
    setQuery(item.query);
    item.filters.forEach(filter => addFilter(filter));
  };

  /**
   * Remove item do histórico
   */
  const removeHistoryItem = (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    useSearchStore.setState({ searchHistory: newHistory });
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    applyHistoryItem,
    removeHistoryItem
  };
}