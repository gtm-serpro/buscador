// src/components/search/SearchCommand/FilterSection.tsx

import { Filter } from 'lucide-react';
import { FILTER_GROUPS } from '@/constants/filters';
import { useFilters } from '@/hooks/useFilters';

export default function FilterSection() {
  const { addFilter, isFilterApplied } = useFilters();

  const handleFilterSelect = (filterId: string, label: string, field: string, type: string) => {
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

  // Divide grupos em 4 colunas
  const groupEntries = Object.entries(FILTER_GROUPS);
  const groupsPerColumn = Math.ceil(groupEntries.length / 4);
  
  const columns = [
    groupEntries.slice(0, groupsPerColumn),
    groupEntries.slice(groupsPerColumn, groupsPerColumn * 2),
    groupEntries.slice(groupsPerColumn * 2, groupsPerColumn * 3),
    groupEntries.slice(groupsPerColumn * 3)
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {columns.map((columnGroups, colIndex) => (
        <div key={colIndex} className="space-y-4">
          {columnGroups.map(([groupKey, group]) => (
            <div key={groupKey}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                {group.label}
              </h4>
              <div className="space-y-0.5">
                {group.filters.map((filter) => {
                  const isApplied = isFilterApplied(filter.id);
                  
                  return (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterSelect(filter.id, filter.label, filter.field, filter.type)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Filter className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className={isApplied ? 'font-semibold flex-1' : 'flex-1'}>
                        {filter.label}
                      </span>
                      {isApplied && (
                        <span className="text-blue-600 text-sm">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}