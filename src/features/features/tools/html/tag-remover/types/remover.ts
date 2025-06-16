export interface TagRemoverOptions {
  preserveText: boolean;
  preserveWhitespace: boolean;
  removeSpecificTags: boolean;
  tagList?: string[];
  convertEntities: boolean;
}

export interface TagRemoverElements {
  htmlInput: HTMLTextAreaElement;
  textOutput: HTMLTextAreaElement;
  errorMessage: HTMLElement;
  successMessage: HTMLElement;
  inputStats: HTMLElement;
  outputStats: HTMLElement;
  options: {
    preserveText: HTMLInputElement;
    preserveWhitespace: HTMLInputElement;
    removeSpecificTags: HTMLInputElement;
    convertEntities: HTMLInputElement;
  };
  tagListInput?: HTMLInputElement;
}

export interface RemovalResult {
  success: boolean;
  text?: string;
  error?: string;
}