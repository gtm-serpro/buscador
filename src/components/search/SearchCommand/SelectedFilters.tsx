// src/components/search/SearchCommand/SelectedFilters.tsx

import { useState, useRef, useEffect } from 'react';
import { X, Check, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFilters } from '@/hooks/useFilters';
import { FILTERS_MAP } from '@/constants/filters';
import type { AppliedFilter, DateRangeValue, NumberRangeValue } from '@/types/filter.types';

interface EditableBadgeProps {
  filter: AppliedFilter;
  onRemove: () => void;
  onUpdate: (newValue: string | DateRangeValue) => void;
}

function EditableBadge({ filter, onRemove, onUpdate }: EditableBadgeProps) {
  const [isEditing, setIsEditing] = useState(!filter.value || filter.value === '');
  const [inputValue, setInputValue] = useState(
    typeof filter.value === 'string' ? filter.value : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const filterDef = FILTERS_MAP[filter.id];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onUpdate(inputValue.trim());
      setIsEditing(false);
    } else {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      if (inputValue.trim()) {
        setIsEditing(false);
      } else {
        onRemove();
      }
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-300 rounded-md">
        <span className="text-xs font-medium text-blue-900">
          {filter.label}:
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleConfirm}
          placeholder={filterDef?.placeholder || 'Digite...'}
          className="w-32 px-1 text-xs bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
        />
        <button
          onClick={handleConfirm}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        >
          <Check className="h-3 w-3 text-blue-700" />
        </button>
        <button
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3 text-blue-700" />
        </button>
      </div>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className="gap-1 pr-1 cursor-pointer hover:bg-gray-300"
      onClick={() => setIsEditing(true)}
    >
      <span className="font-medium">{filter.label}:</span>
      <span>{inputValue}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 hover:bg-gray-400 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

interface DateRangeBadgeProps {
  filter: AppliedFilter;
  onRemove: () => void;
  onUpdate: (newValue: DateRangeValue) => void;
}

function DateRangeBadge({ filter, onRemove, onUpdate }: DateRangeBadgeProps) {
  const hasValues = typeof filter.value === 'object' && 'from' in filter.value && (filter.value.from || filter.value.to);
  const [isEditing, setIsEditing] = useState(!hasValues);
  
  const [dateRange, setDateRange] = useState<DateRangeValue>(
    typeof filter.value === 'object' && 'from' in filter.value
      ? filter.value as DateRangeValue
      : { from: '', to: '' }
  );
  const [fromDate, setFromDate] = useState<Date | undefined>(
    dateRange.from ? new Date(dateRange.from) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    dateRange.to ? new Date(dateRange.to) : undefined
  );

  const formatDisplayValue = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(new Date(dateRange.from), 'dd/MM/yyyy')} até ${format(new Date(dateRange.to), 'dd/MM/yyyy')}`;
    }
    if (dateRange.from) {
      return `A partir de ${format(new Date(dateRange.from), 'dd/MM/yyyy')}`;
    }
    if (dateRange.to) {
      return `Até ${format(new Date(dateRange.to), 'dd/MM/yyyy')}`;
    }
    return 'Selecione...';
  };

  const handleConfirm = () => {
    if (fromDate || toDate) {
      const newRange: DateRangeValue = {
        from: fromDate ? fromDate.toISOString() : '',
        to: toDate ? toDate.toISOString() : ''
      };
      setDateRange(newRange);
      onUpdate(newRange);
      setIsEditing(false);
    } else {
      onRemove();
    }
  };

  if (isEditing) {
  const handleManualInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'from' | 'to'
  ) => {
    const value = e.target.value;
    const [day, month, year] = value.split('/');
    const parsed = new Date(`${year}-${month}-${day}`);

    if (!isNaN(parsed.getTime())) {
      if (type === 'from') setFromDate(parsed);
      else setToDate(parsed);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-100 border border-blue-300 rounded-md">
      <span className="text-xs font-medium text-blue-900">
        {filter.label}:
      </span>

      {/* Date From */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={fromDate ? format(fromDate, 'dd/MM/yyyy') : ''}
          onChange={(e) => handleManualInput(e, 'from')}
          placeholder="De"
          className="w-24 px-2 py-1 text-xs bg-white border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Popover>
          <PopoverTrigger asChild>
            <CalendarIcon className="absolute right-1.5 top-1.5 h-4 w-4 text-blue-700 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date To */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={toDate ? format(toDate, 'dd/MM/yyyy') : ''}
          onChange={(e) => handleManualInput(e, 'to')}
          placeholder="Até"
          className="w-24 px-2 py-1 text-xs bg-white border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Popover>
          <PopoverTrigger asChild>
            <CalendarIcon className="absolute right-1.5 top-1.5 h-4 w-4 text-blue-700 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={setToDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <button
        onClick={handleConfirm}
        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
      >
        <Check className="h-3 w-3 text-blue-700" />
      </button>
      <button
        onClick={onRemove}
        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3 text-blue-700" />
      </button>
    </div>
  );
}

  return (
    <Badge 
      variant="secondary" 
      className="gap-1 pr-1 cursor-pointer hover:bg-gray-300"
      onClick={() => setIsEditing(true)}
    >
      <span className="font-medium">{filter.label}:</span>
      <span className="text-xs">{formatDisplayValue()}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 hover:bg-gray-400 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

interface NumberRangeBadgeProps {
  filter: AppliedFilter;
  onRemove: () => void;
  onUpdate: (newValue: NumberRangeValue) => void;
}

function NumberRangeBadge({ filter, onRemove, onUpdate }: NumberRangeBadgeProps) {
  const hasValues = typeof filter.value === 'object' && 'from' in filter.value && 
    typeof filter.value.from === 'number' && (filter.value.from !== 0 || filter.value.to !== 0);
  const [isEditing, setIsEditing] = useState(!hasValues);
  const [numberRange, setNumberRange] = useState<NumberRangeValue>(
    typeof filter.value === 'object' && 'from' in filter.value && typeof filter.value.from === 'number'
      ? filter.value as NumberRangeValue
      : { from: 0, to: 0 }
  );
  const [fromValue, setFromValue] = useState<string>(
    numberRange.from ? numberRange.from.toString() : ''
  );
  const [toValue, setToValue] = useState<string>(
    numberRange.to ? numberRange.to.toString() : ''
  );

  const formatDisplayValue = () => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    if (numberRange.from && numberRange.to) {
      return `${formatCurrency(numberRange.from)} até ${formatCurrency(numberRange.to)}`;
    }
    if (numberRange.from) {
      return `A partir de ${formatCurrency(numberRange.from)}`;
    }
    if (numberRange.to) {
      return `Até ${formatCurrency(numberRange.to)}`;
    }
    return 'Selecione...';
  };

  const handleConfirm = () => {
    const from = fromValue ? parseFloat(fromValue.replace(/[^\d,.-]/g, '').replace(',', '.')) : undefined;
    const to = toValue ? parseFloat(toValue.replace(/[^\d,.-]/g, '').replace(',', '.')) : undefined;

    if (from !== undefined || to !== undefined) {
      const newRange: NumberRangeValue = {
        from: from || 0,
        to: to || 0
      };
      setNumberRange(newRange);
      onUpdate(newRange);
      setIsEditing(false);
    } else {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      if (fromValue || toValue) {
        setIsEditing(false);
      } else {
        onRemove();
      }
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-100 border border-blue-300 rounded-md">
        <span className="text-xs font-medium text-blue-900">
          {filter.label}:
        </span>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-blue-700">De:</span>
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mínimo"
            className="w-24 px-2 py-1 text-xs bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
            step="0.01"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-blue-700">Até:</span>
          <input
            type="number"
            value={toValue}
            onChange={(e) => setToValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Máximo"
            className="w-24 px-2 py-1 text-xs bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
            step="0.01"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        >
          <Check className="h-3 w-3 text-blue-700" />
        </button>
        <button
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3 text-blue-700" />
        </button>
      </div>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className="gap-1 pr-1 cursor-pointer hover:bg-gray-300"
      onClick={() => setIsEditing(true)}
    >
      <span className="font-medium">{filter.label}:</span>
      <span className="text-xs">{formatDisplayValue()}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 hover:bg-gray-400 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export default function SelectedFilters() {
  const { appliedFilters, removeFilter, addFilter } = useFilters();

  const handleUpdate = (filter: AppliedFilter, newValue: string | DateRangeValue | NumberRangeValue) => {
    removeFilter(filter.id, typeof filter.value === 'string' ? filter.value : undefined);
    
    addFilter({
      id: filter.id,
      label: filter.label,
      field: filter.field,
      value: newValue
    });
  };

  const handleRemove = (filter: AppliedFilter) => {
    removeFilter(filter.id, typeof filter.value === 'string' ? filter.value : undefined);
  };

  if (appliedFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
      {appliedFilters.map((filter, idx) => {
        const filterDef = FILTERS_MAP[filter.id];
        
        // Filtros de data com date picker
        if (filterDef?.type === 'date-range') {
          return (
            <DateRangeBadge
              key={`${filter.id}-${idx}`}
              filter={filter}
              onRemove={() => handleRemove(filter)}
              onUpdate={(newValue) => handleUpdate(filter, newValue)}
            />
          );
        }

        // Filtros de número/valor
        if (filterDef?.type === 'number-range') {
          return (
            <NumberRangeBadge
              key={`${filter.id}-${idx}`}
              filter={filter}
              onRemove={() => handleRemove(filter)}
              onUpdate={(newValue) => handleUpdate(filter, newValue)}
            />
          );
        }

        // Filtros de texto e autocomplete são editáveis inline
        if (filterDef?.type === 'text' || filterDef?.type === 'autocomplete') {
          return (
            <EditableBadge
              key={`${filter.id}-${idx}`}
              filter={filter}
              onRemove={() => handleRemove(filter)}
              onUpdate={(newValue) => handleUpdate(filter, newValue)}
            />
          );
        }

        // Badge genérico para outros tipos
        return (
          <Badge 
            key={`${filter.id}-${idx}`} 
            variant="secondary" 
            className="gap-1 pr-1"
          >
            <span className="font-medium">{filter.label}:</span>
            <span>{filter.displayValue || String(filter.value)}</span>
            <button
              onClick={() => handleRemove(filter)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
    </div>
  );
}