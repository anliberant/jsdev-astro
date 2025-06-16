import type { TableConfig, TableRow, TableCell } from '../model/types';

export class TableGeneratorController {
  private config: TableConfig;
  private data: TableRow[];

  constructor(config: TableConfig = {}) {
    this.config = {
      rows: 3,
      cols: 3,
      hasHeader: true,
      bordered: true,
      striped: false,
      responsive: true,
      ...config
    };
    this.data = this.initializeData();
  }

  private initializeData(): TableRow[] {
    const rows: TableRow[] = [];
    
    for (let i = 0; i < this.config.rows!; i++) {
      const cells: TableCell[] = [];
      for (let j = 0; j < this.config.cols!; j++) {
        cells.push({
          content: i === 0 && this.config.hasHeader ? `Header ${j + 1}` : `Cell ${i + 1}-${j + 1}`,
          isHeader: i === 0 && this.config.hasHeader,
          colspan: 1,
          rowspan: 1
        });
      }
      rows.push({ cells, isHeader: i === 0 && this.config.hasHeader });
    }
    
    return rows;
  }

  public updateConfig(newConfig: Partial<TableConfig>): void {
    const oldRows = this.config.rows;
    const oldCols = this.config.cols;
    
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.rows !== undefined && newConfig.rows !== oldRows) {
      this.resizeRows(newConfig.rows);
    }
    
    if (newConfig.cols !== undefined && newConfig.cols !== oldCols) {
      this.resizeCols(newConfig.cols);
    }
    
    if (newConfig.hasHeader !== undefined) {
      this.updateHeaderStatus(newConfig.hasHeader);
    }
  }

  private resizeRows(newRowCount: number): void {
    const currentRowCount = this.data.length;
    
    if (newRowCount > currentRowCount) {
      for (let i = currentRowCount; i < newRowCount; i++) {
        const cells: TableCell[] = [];
        for (let j = 0; j < this.config.cols!; j++) {
          cells.push({
            content: `Cell ${i + 1}-${j + 1}`,
            isHeader: false,
            colspan: 1,
            rowspan: 1
          });
        }
        this.data.push({ cells, isHeader: false });
      }
    } else {
      this.data = this.data.slice(0, newRowCount);
    }
  }

  private resizeCols(newColCount: number): void {
    this.data.forEach((row, rowIndex) => {
      const currentColCount = row.cells.length;
      
      if (newColCount > currentColCount) {
        for (let j = currentColCount; j < newColCount; j++) {
          row.cells.push({
            content: rowIndex === 0 && this.config.hasHeader 
              ? `Header ${j + 1}` 
              : `Cell ${rowIndex + 1}-${j + 1}`,
            isHeader: rowIndex === 0 && this.config.hasHeader,
            colspan: 1,
            rowspan: 1
          });
        }
      } else {
        row.cells = row.cells.slice(0, newColCount);
      }
    });
  }

  private updateHeaderStatus(hasHeader: boolean): void {
    if (this.data.length > 0) {
      this.data[0].isHeader = hasHeader;
      this.data[0].cells.forEach((cell, index) => {
        cell.isHeader = hasHeader;
        if (hasHeader && cell.content.startsWith('Cell 1-')) {
          cell.content = `Header ${index + 1}`;
        } else if (!hasHeader && cell.content.startsWith('Header ')) {
          cell.content = `Cell 1-${index + 1}`;
        }
      });
    }
  }

  public updateCell(rowIndex: number, colIndex: number, content: string): void {
    if (this.data[rowIndex] && this.data[rowIndex].cells[colIndex]) {
      this.data[rowIndex].cells[colIndex].content = content;
    }
  }

  public mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    const rowspan = endRow - startRow + 1;
    const colspan = endCol - startCol + 1;
    
    if (this.data[startRow] && this.data[startRow].cells[startCol]) {
      this.data[startRow].cells[startCol].rowspan = rowspan;
      this.data[startRow].cells[startCol].colspan = colspan;
      
      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          if (i !== startRow || j !== startCol) {
            if (this.data[i] && this.data[i].cells[j]) {
              this.data[i].cells[j].merged = true;
            }
          }
        }
      }
    }
  }

  public addRow(index?: number): void {
    const insertIndex = index ?? this.data.length;
    const cells: TableCell[] = [];
    
    for (let j = 0; j < this.config.cols!; j++) {
      cells.push({
        content: `Cell ${insertIndex + 1}-${j + 1}`,
        isHeader: false,
        colspan: 1,
        rowspan: 1
      });
    }
    
    this.data.splice(insertIndex, 0, { cells, isHeader: false });
    this.config.rows = this.data.length;
  }

  public addColumn(index?: number): void {
    const insertIndex = index ?? this.config.cols!;
    
    this.data.forEach((row, rowIndex) => {
      const newCell: TableCell = {
        content: rowIndex === 0 && this.config.hasHeader 
          ? `Header ${insertIndex + 1}` 
          : `Cell ${rowIndex + 1}-${insertIndex + 1}`,
        isHeader: rowIndex === 0 && this.config.hasHeader,
        colspan: 1,
        rowspan: 1
      };
      row.cells.splice(insertIndex, 0, newCell);
    });
    
    this.config.cols = this.data[0]?.cells.length || 0;
  }

  public removeRow(index: number): void {
    if (this.data.length > 1) {
      this.data.splice(index, 1);
      this.config.rows = this.data.length;
    }
  }

  public removeColumn(index: number): void {
    if (this.config.cols! > 1) {
      this.data.forEach(row => {
        row.cells.splice(index, 1);
      });
      this.config.cols = this.data[0]?.cells.length || 0;
    }
  }

  public generateHTML(): string {
    const tableClasses = this.getTableClasses();
    let html = `<table${tableClasses ? ` class="${tableClasses}"` : ''}>`;
    
    if (this.config.hasHeader && this.data.length > 0) {
      html += '\n  <thead>\n    <tr>';
      this.data[0].cells.forEach(cell => {
        if (!cell.merged) {
          const attributes = this.getCellAttributes(cell);
          html += `\n      <th${attributes}>${cell.content}</th>`;
        }
      });
      html += '\n    </tr>\n  </thead>';
    }
    
    const bodyRows = this.config.hasHeader ? this.data.slice(1) : this.data;
    if (bodyRows.length > 0) {
      html += '\n  <tbody>';
      bodyRows.forEach(row => {
        html += '\n    <tr>';
        row.cells.forEach(cell => {
          if (!cell.merged) {
            const attributes = this.getCellAttributes(cell);
            html += `\n      <td${attributes}>${cell.content}</td>`;
          }
        });
        html += '\n    </tr>';
      });
      html += '\n  </tbody>';
    }
    
    html += '\n</table>';
    return html;
  }

  private getTableClasses(): string {
    const classes: string[] = [];
    
    if (this.config.bordered) classes.push('table-bordered');
    if (this.config.striped) classes.push('table-striped');
    if (this.config.responsive) classes.push('table-responsive');
    
    return classes.join(' ');
  }

  private getCellAttributes(cell: TableCell): string {
    const attributes: string[] = [];
    
    if (cell.colspan && cell.colspan > 1) {
      attributes.push(`colspan="${cell.colspan}"`);
    }
    
    if (cell.rowspan && cell.rowspan > 1) {
      attributes.push(`rowspan="${cell.rowspan}"`);
    }
    
    return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
  }

  public exportAsCSV(): string {
    let csv = '';
    
    this.data.forEach((row, rowIndex) => {
      const cellValues = row.cells
        .filter(cell => !cell.merged)
        .map(cell => {
          const content = cell.content.replace(/"/g, '""');
          return /[",\n]/.test(content) ? `"${content}"` : content;
        });
      
      csv += cellValues.join(',');
      if (rowIndex < this.data.length - 1) {
        csv += '\n';
      }
    });
    
    return csv;
  }

  public importFromCSV(csvContent: string): void {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const newData: TableRow[] = [];
    
    lines.forEach((line, rowIndex) => {
      const cells: TableCell[] = [];
      const values = this.parseCSVLine(line);
      
      values.forEach((value, colIndex) => {
        cells.push({
          content: value,
          isHeader: rowIndex === 0 && this.config.hasHeader,
          colspan: 1,
          rowspan: 1
        });
      });
      
      newData.push({
        cells,
        isHeader: rowIndex === 0 && this.config.hasHeader
      });
    });
    
    if (newData.length > 0) {
      this.data = newData;
      this.config.rows = newData.length;
      this.config.cols = newData[0].cells.length;
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 2;
        } else {
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    result.push(current);
    return result;
  }

  public getData(): TableRow[] {
    return this.data;
  }

  public getConfig(): TableConfig {
    return { ...this.config };
  }

  public reset(): void {
    this.data = this.initializeData();
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}