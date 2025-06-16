// Обновленные типы для JSX конвертера
export interface HtmlToJsxElements extends BaseConverterElements {
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

export interface JsxConversionOptions {
  prettify: boolean;
  camelCase: boolean;
  useFragment: boolean;
}