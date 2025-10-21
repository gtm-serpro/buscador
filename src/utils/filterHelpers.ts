// src/utils/filterHelpers.ts

import type { AppliedFilter, DateRangeValue, NumberRangeValue } from '@/types/filter.types';
import { FILTERS_MAP } from '@/constants/filters';

/**
 * Formata o valor do filtro para exibição no chip
 */
export function formatFilterDisplayValue(filter: AppliedFilter): string {
  const filterDef = FILTERS_MAP[filter.id];
  
  if (!filterDef) return String(filter.value);
  
  const { value } = filter;
  const { type } = filterDef;
  
  if (type === 'date-range' && typeof value === 'object' && 'from' in value) {
    const range = value as DateRangeValue;
    if (range.from && range.to) {
      return `${formatDate(range.from)} até ${formatDate(range.to)}`;
    }
    if (range.from) return `A partir de ${formatDate(range.from)}`;
    if (range.to) return `Até ${formatDate(range.to)}`;
  }
  
  if (type === 'number-range' && typeof value === 'object' && 'from' in value) {
    const range = value as unknown as NumberRangeValue;
    if (range.from !== undefined && range.to !== undefined) {
      return `${formatCurrency(range.from)} - ${formatCurrency(range.to)}`;
    }
    if (range.from !== undefined) return `A partir de ${formatCurrency(range.from)}`;
    if (range.to !== undefined) return `Até ${formatCurrency(range.to)}`;
  }
  
  if (Array.isArray(value)) {
    return value.length > 2 
      ? `${value.slice(0, 2).join(', ')} +${value.length - 2}`
      : value.join(', ');
  }
  
  return String(value);
}

/**
 * Formata data para dd/mm/yyyy
 */
function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata valor monetário
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Valida se um filtro está completo
 */
export function isFilterValid(filter: AppliedFilter): boolean {
  const { value } = filter;
  const filterDef = FILTERS_MAP[filter.id];
  
  if (!filterDef) return false;
  
  if (filterDef.type === 'date-range' || filterDef.type === 'number-range') {
    if (typeof value === 'object' && 'from' in value) {
      const range = value as DateRangeValue | NumberRangeValue;
      return !!(range.from || range.to);
    }
    return false;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return !!value && String(value).trim().length > 0;
}