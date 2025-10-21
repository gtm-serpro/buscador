// src/types/filter.types.ts

export type FilterType = 
  | 'text' 
  | 'autocomplete' 
  | 'date-range' 
  | 'number-range'
  | 'checkbox';

export interface FilterOption {
  id: string;
  label: string;
  field: string;
  type: FilterType;
  placeholder?: string;
  helperText?: string;
}

export interface DateRangeValue {
  from: string;
  to: string;
}

export interface NumberRangeValue {
  from: number;
  to: number;
}

export interface AppliedFilter {
  id: string;
  label: string;
  field: string;
  value: string | string[] | DateRangeValue | NumberRangeValue;
  displayValue?: string;
}