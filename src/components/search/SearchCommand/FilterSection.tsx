// src/components/search/SearchCommand/FilterSection.tsx

import { Filter } from 'lucide-react';
import { FILTER_GROUPS } from '@/constants/filters';
import { useFilters } from '@/hooks/useFilters';
import { useSearchStore } from '@/stores/searchStore';

export default function FilterSection() {
  const { addFilter, isFilterApplied } = useFilters();
  const { appliedFilters, removeFilter } = useSearchStore();

  const handleFilterSelect = (filterId: string, label: string, field: string, type: string) => {
    appliedFilters.forEach(filter => {
      const isEmpty = 
        filter.value === '' || 
        (typeof filter.value === 'object' && 'from' in filter.value && !filter.value.from && !filter.value.to) ||
        (typeof filter.value === 'object' && 'from' in filter.value && typeof filter.value.from === 'number' && filter.value.from === 0 && filter.value.to === 0);
      
      if (isEmpty) {
        removeFilter(filter.id);
      }
    });

    if (type === 'date-range') {
      addFilter({
        id: filterId,
        label: label,
        field: field,
        value: { from: '', to: '' }
      });
    } else if (type === 'number-range') {
      addFilter({
        id: filterId,
        label: label,
        field: field,
        value: { from: 0, to: 0 }
      });
    } else {
      addFilter({
        id: filterId,
        label: label,
        field: field,
        value: ''
      });
    }
  };

  const groupEntries = Object.entries(FILTER_GROUPS);
  
  // Responsivo: 1 coluna no mobile, 2 no tablet, 4 no desktop
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3 md:p-4">
      {groupEntries.map(([groupKey, group]) => (
        <div key={groupKey} className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
            {group.label}
          </h4>
          <div className="space-y-0.5">
            {group.filters.map((filter) => {
              const isApplied = isFilterApplied(filter.id);
              
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterSelect(filter.id, filter.label, filter.field, filter.type)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded-md hover:bg-gray-100 transition-colors active:bg-gray-200"
                >
                  <Filter className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className={`${isApplied ? 'font-semibold' : ''} flex-1 truncate`}>
                    {filter.label}
                  </span>
                  {isApplied && (
                    <span className="text-blue-600 text-sm shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}