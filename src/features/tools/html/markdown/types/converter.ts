export interface HtmlMarkdownConversionOptions {
  preserveHtml: boolean;
  preserveWhitespace: boolean;
  convertTables: boolean;
  sanitize?: boolean;
  allowHtml?: boolean;
}

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