// stores/searchStore.ts

import { create } from 'zustand';
import { Document, AppliedFilter } from '@/types/document.types';

interface GroupCount {
  name: string;
  count: number;
  subgroups: { name: string; count: number }[];
}

interface SearchState {
  // Query e Filtros
  query: string;
  appliedFilters: AppliedFilter[];
  
  // Resultados
  documents: Document[];
  totalDocuments: number;
  
  // Paginação
  currentPage: number;
  pageSize: number;
  
  // Sidebar
  groupCounts: {
    grupoProcesso: GroupCount[];
    tipoProcesso: GroupCount[];
  };
  
  // UI State
  isSearching: boolean;
  showCommandModal: boolean;
  hasSearched: boolean;
  error: string | null;
  
  // Histórico
  searchHistory: Array<{
    query: string;
    filters: AppliedFilter[];
    timestamp: Date;
  }>;
  
  // Actions
  setQuery: (query: string) => void;
  addFilter: (filter: AppliedFilter) => void;
  removeFilter: (filterId: string, value?: string) => void;
  clearFilters: () => void;
  
  setDocuments: (docs: Document[], total: number) => void;
  setGroupCounts: (groups: any) => void;
  
  setCurrentPage: (page: number) => void;
  setIsSearching: (loading: boolean) => void;
  setShowCommandModal: (show: boolean) => void;
  setError: (error: string | null) => void;
  
  addToHistory: (query: string, filters: AppliedFilter[]) => void;
  clearHistory: () => void;
  
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // Estado inicial
  query: '',
  appliedFilters: [],
  documents: [],
  totalDocuments: 0,
  currentPage: 1,
  pageSize: 20,
  groupCounts: {
    grupoProcesso: [],
    tipoProcesso: []
  },
  isSearching: false,
  showCommandModal: true,
  hasSearched: false,
  error: null,
  searchHistory: [],
  
  // Actions
  setQuery: (query) => set({ query }),
  
  addFilter: (filter) => set((state) => {
    const exists = state.appliedFilters.find(
      f => f.id === filter.id && f.value === filter.value
    );
    if (exists) return state;
    return { appliedFilters: [...state.appliedFilters, filter] };
  }),
  
  removeFilter: (filterId, value) => set((state) => ({
    appliedFilters: state.appliedFilters.filter(
      f => value ? !(f.id === filterId && f.value === value) : f.id !== filterId
    )
  })),
  
  clearFilters: () => set({ appliedFilters: [] }),
  
  setDocuments: (docs, total) => set({
    documents: docs,
    totalDocuments: total,
    hasSearched: true
  }),
  
  setGroupCounts: (groups) => set({ groupCounts: groups }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setIsSearching: (loading) => set({ isSearching: loading }),
  
  setShowCommandModal: (show) => set({ showCommandModal: show }),
  
  setError: (error) => set({ error }),
  
  addToHistory: (query, filters) => set((state) => ({
    searchHistory: [
      { query, filters, timestamp: new Date() },
      ...state.searchHistory.slice(0, 9) // mantém últimas 10
    ]
  })),
  
  clearHistory: () => set({ searchHistory: [] }),
  
  reset: () => set({
    query: '',
    appliedFilters: [],
    documents: [],
    totalDocuments: 0,
    currentPage: 1,
    hasSearched: false,
    error: null
  })
}));