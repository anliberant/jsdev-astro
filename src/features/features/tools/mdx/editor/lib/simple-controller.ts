import { marked } from 'marked';

export class SimpleMDXController {
  private editor: HTMLTextAreaElement | null = null;
  private preview: HTMLElement | null = null;
  private htmlOutput: HTMLElement | null = null;

  constructor() {
    const requiredElements = ['editor', 'preview', 'htmlOutput'];
    const elementsExist = requiredElements.every(id => document.getElementById(id));
    if (!elementsExist) return;

    this.initializeElements();
    this.bindEvents();
    this.updatePreview();
  }

  private initializeElements(): void {
    this.editor = document.getElementById('editor') as HTMLTextAreaElement;
    this.preview = document.getElementById('preview') as HTMLElement;
    this.htmlOutput = document.getElementById('htmlOutput') as HTMLElement;
  }

  private bindEvents(): void {
    if (this.editor) {
      this.editor.addEventListener('input', () => this.updatePreview());
    }
  }

  private updatePreview(): void {
    if (this.editor && this.preview && this.htmlOutput) {
      const content = this.editor.value;
      const rendered = marked.parse(content);
      this.preview.innerHTML = rendered;
      this.htmlOutput.textContent = content;
    }
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}