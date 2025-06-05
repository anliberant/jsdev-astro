export interface ConversionResult {
  success: boolean;
  astroCode?: string;
  error?: string;
}

export interface ConverterElements {
  htmlInput: HTMLTextAreaElement;
  astroOutput: HTMLTextAreaElement;
  errorMessage: HTMLElement;
  successMessage: HTMLElement;
}
