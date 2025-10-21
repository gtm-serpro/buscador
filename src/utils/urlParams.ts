// src/utils/urlParams.ts

import type { AppliedFilter, DateRangeValue, NumberRangeValue } from '@/types/filter.types';
import { FILTERS_MAP } from '@/constants/filters';

/**
 * Sincroniza o estado da busca com a URL
 */
export function syncURLWithFilters(
  setSearchParams: (params: URLSearchParams) => void,
  state: {
    q: string;
    filters: AppliedFilter[];
    page: number;
  }
) {
  const newParams = new URLSearchParams();
  
  // Adiciona query
  if (state.q) {
    newParams.set('q', state.q);
  }
  
  // Adiciona filtros
  state.filters.forEach(filter => {
    const value = Array.isArray(filter.value) 
      ? filter.value.join(',') 
      : typeof filter.value === 'object'
        ? JSON.stringify(filter.value)
        : String(filter.value);
    
    newParams.append(filter.id, value);
  });
  
  // Adiciona página (se não for a primeira)
  if (state.page > 1) {
    newParams.set('page', state.page.toString());
  }
  
  setSearchParams(newParams);
}

/**
 * Lê os filtros da URL e retorna o estado inicial
 */
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
    // Ignora parâmetros especiais
    if (key === 'q' || key === 'page') return;
    
    // Busca definição do filtro
    const filterDef = FILTERS_MAP[key];
    if (!filterDef) return;
    
    // Parse do valor baseado no tipo
    let parsedValue: string | string[] | DateRangeValue | NumberRangeValue;
    
    if (filterDef.type === 'autocomplete' && value.includes(',')) {
      // Múltiplos valores separados por vírgula
      parsedValue = value.split(',');
    } else if (filterDef.type === 'date-range' || filterDef.type === 'number-range') {
      // JSON para ranges
      try {
        parsedValue = JSON.parse(value);
      } catch {
        return; // Ignora se não conseguir fazer parse
      }
    } else {
      parsedValue = value;
    }
    
    filters.push({
      id: filterDef.id,
      label: filterDef.label,
      field: filterDef.field,
      value: parsedValue
    });
  });
  
  return { query, filters, page };
}