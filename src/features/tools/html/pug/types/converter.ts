export interface PugConversionOptions {
  prettify: boolean;
  combineText: boolean;
  preserveComments: boolean;
}

export interface HtmlToPugElements {
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

export interface ConversionResult {
  success: boolean;
  pugCode?: string;
  error?: string;
}

export interface ConversionStats {
  lines: number;
  characters: number;
}