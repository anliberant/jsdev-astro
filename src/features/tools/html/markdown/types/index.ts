export interface HtmlMarkdownElements extends BaseConverterElements {
  htmlInput: HTMLTextAreaElement;
  markdownOutput: HTMLTextAreaElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    preserveHtml: HTMLInputElement;
    preserveWhitespace: HTMLInputElement;
    convertTables: HTMLInputElement;
  };
  modeToggle: HTMLButtonElement;
}

export interface HtmlMarkdownOptions {
  preserveHtml: boolean;
  preserveWhitespace: boolean;
  convertTables: boolean;
}