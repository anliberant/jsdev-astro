export type ConversionMode = 'html-to-markdown' | 'markdown-to-html';

export interface ConversionResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface ConversionStats {
  lines: number;
  characters: number;
  words: number;
}