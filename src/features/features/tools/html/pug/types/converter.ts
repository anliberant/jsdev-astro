export interface ConversionOptions {
  prettify: boolean;
  combineText: boolean;
  preserveComments: boolean;
}

export interface ConversionResult {
  success: boolean;
  pugCode?: string;
  error?: string;
}

export interface ConversionStats {
  lines: number;
  characters: number;
}

export interface ConverterElements {
  htmlInput: HTMLTextAreaElement;
  pugOutput: HTMLTextAreaElement;
  errorMessage: HTMLElement;
  successMessage: HTMLElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    prettify: HTMLInputElement;
    combineText: HTMLInputElement;
    preserveComments: HTMLInputElement;
  };
}
