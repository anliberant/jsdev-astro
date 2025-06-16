export interface TableCell {
  content: string;
  isHeader?: boolean;
  colspan?: number;
  rowspan?: number;
  merged?: boolean;
  className?: string;
  style?: Record<string, string>;
}

export interface TableRow {
  cells: TableCell[];
  isHeader?: boolean;
  className?: string;
  style?: Record<string, string>;
}

export interface TableConfig {
  rows?: number;
  cols?: number;
  hasHeader?: boolean;
  bordered?: boolean;
  striped?: boolean;
  responsive?: boolean;
  className?: string;
  style?: Record<string, string>;
}

export interface TableSelection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface ExportOptions {
  format: 'html' | 'csv' | 'json' | 'markdown';
  includeStyles?: boolean;
  minified?: boolean;
}

export interface ImportOptions {
  format: 'csv' | 'json' | 'tsv';
  hasHeader?: boolean;
  delimiter?: string;
}

export interface TableTheme {
  name: string;
  styles: {
    table?: Record<string, string>;
    header?: Record<string, string>;
    cell?: Record<string, string>;
    evenRow?: Record<string, string>;
    oddRow?: Record<string, string>;
  };
}

export interface TablePreset {
  name: string;
  description: string;
  config: TableConfig;
  data?: TableRow[];
}

export interface TableEvent {
  type: 'cell-change' | 'config-change' | 'selection-change' | 'structure-change';
  payload: any;
}

export interface CellChangeEvent extends TableEvent {
  type: 'cell-change';
  payload: {
    rowIndex: number;
    colIndex: number;
    oldValue: string;
    newValue: string;
  };
}

export interface ConfigChangeEvent extends TableEvent {
  type: 'config-change';
  payload: {
    oldConfig: TableConfig;
    newConfig: TableConfig;
  };
}

export interface SelectionChangeEvent extends TableEvent {
  type: 'selection-change';
  payload: {
    selection: TableSelection | null;
    selectedCells: string[];
  };
}

export interface StructureChangeEvent extends TableEvent {
  type: 'structure-change';
  payload: {
    action: 'add-row' | 'remove-row' | 'add-column' | 'remove-column' | 'merge-cells' | 'split-cells';
    indices: number[];
  };
}