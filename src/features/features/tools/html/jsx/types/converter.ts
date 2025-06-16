export interface ConversionOptions {
  prettify: boolean;
  camelCase: boolean;
  useFragment: boolean;
}

export interface ConversionResult {
  success: boolean;
  jsxCode?: string;
  error?: string;
}

export interface ConversionStats {
  lines: number;
  characters: number;
}

export interface ConverterElements {
  htmlInput: HTMLTextAreaElement;
  jsxOutput: HTMLTextAreaElement;
  errorMessage: HTMLElement;
  successMessage: HTMLElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    prettify: HTMLInputElement;
    camelCase: HTMLInputElement;
    fragment: HTMLInputElement;
  };
}

export interface HtmlToJsxAttributeMap {
  [key: string]: string;
}
