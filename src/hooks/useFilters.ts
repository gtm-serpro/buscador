// src/hooks/useFilters.ts

import { useSearchStore } from '@/stores/searchStore';
import type { AppliedFilter, DateRangeValue, NumberRangeValue } from '@/types/filter.types';
import { FILTERS_MAP } from '@/constants/filters';
import { formatFilterDisplayValue } from '@/utils/filterHelpers';

export function useFilters() {
  const { appliedFilters, addFilter, removeFilter, clearFilters } = useSearchStore();

  /**
   * Adiciona um filtro com formatação automática do displayValue
   */
  const addFilterWithDisplay = (filter: Omit<AppliedFilter, 'displayValue'>) => {
    const completeFilter: AppliedFilter = {
      ...filter,
      displayValue: formatFilterDisplayValue(filter as AppliedFilter)
    };
    addFilter(completeFilter);
  };

  /**
   * Verifica se um filtro específico está aplicado
   */
  const isFilterApplied = (filterId: string, value?: string | DateRangeValue | NumberRangeValue): boolean => {
    return appliedFilters.some(f => {
      if (f.id !== filterId) return false;
      if (!value) return true;
      return JSON.stringify(f.value) === JSON.stringify(value);
    });
  };

  /**
   * Retorna os filtros aplicados agrupados por tipo
   */
  const getFiltersByType = (type: string) => {
    return appliedFilters.filter(f => {
      const filterDef = FILTERS_MAP[f.id];
      return filterDef?.type === type;
    });
  };

  /**
   * Conta quantos filtros de cada tipo estão aplicados
   */
  const getFilterCount = () => {
    return {
      total: appliedFilters.length,
      byType: appliedFilters.reduce((acc, filter) => {
        const filterDef = FILTERS_MAP[filter.id];
        if (filterDef) {
          acc[filterDef.type] = (acc[filterDef.type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
  };

  return {
    appliedFilters,
    addFilter: addFilterWithDisplay,
    removeFilter,
    clearFilters,
    isFilterApplied,
    getFiltersByType,
    getFilterCount
  };
}