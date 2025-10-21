// utils/urlParams.ts

import { AppliedFilter } from '@/types/document.types';

export function syncURLWithFilters(
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void,
  state: {
    q: string;
    filters: AppliedFilter[];
    page: number;
  }
) {
  const newParams = new URLSearchParams();
  
  if (state.q) {
    newParams.set('q', state.q);
  }
  
  state.filters.forEach(filter => {
    const value = Array.isArray(filter.value) 
      ? filter.value.join(',') 
      : filter.value;
    newParams.append(filter.id, value);
  });
  
  if (state.page > 1) {
    newParams.set('page', state.page.toString());
  }
  
  setSearchParams(newParams, { replace: true });
}

export function syncFiltersWithURL(searchParams: URLSearchParams): {
  query: string;
  filters: AppliedFilter[];
  page: number;
} {
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const filters: AppliedFilter[] = [];
  
  // Processa cada parâmetro da URL
  searchParams.forEach((value, key) => {
    if (key === 'q' || key === 'page') return;
    
    // TODO: Mapear key para filtro completo
    // Precisa do AVAILABLE_FILTERS para pegar field, label, etc
  });
  
  return { query, filters, page };
}