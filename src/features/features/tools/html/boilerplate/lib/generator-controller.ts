import { generateHTMLBoilerplate } from './html-generator';
import type { BoilerplateConfig } from '@/shared/types';
import {
  copyToClipboard,
  getElementById,
  getInputValue,
  temporaryButtonText,
} from '@/shared/lib/index';

export class BoilerplateGeneratorController {
  private titleInput: HTMLInputElement | null = null;
  private descriptionInput: HTMLTextAreaElement | null = null;
  private authorInput: HTMLInputElement | null = null;
  private generateBtn: HTMLButtonElement | null = null;
  private copyBtn: HTMLButtonElement | null = null;
  private outputElement: HTMLElement | null = null;

  constructor() {
    this.initializeElements();
    if (
      this.titleInput &&
      this.descriptionInput &&
      this.authorInput &&
      this.generateBtn &&
      this.copyBtn &&
      this.outputElement
    ) {
      this.bindEvents();
      this.updateHTML();
    }
  }

  private initializeElements(): void {
    this.titleInput = getElementById<HTMLInputElement>('title');
    this.descriptionInput = getElementById<HTMLTextAreaElement>('description');
    this.authorInput = getElementById<HTMLInputElement>('author');
    this.generateBtn = getElementById<HTMLButtonElement>('generateBtn');
    this.copyBtn = getElementById<HTMLButtonElement>('copyBtn');
    this.outputElement = getElementById<HTMLElement>('htmlOutput');
  }

  private bindEvents(): void {
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.updateHTML());
    }

    if (this.copyBtn && this.outputElement) {
      this.copyBtn.addEventListener('click', async () => {
        await copyToClipboard(this.outputElement!.textContent || '');
        temporaryButtonText(this.copyBtn!, 'Copied!');
      });
    }
  }

  private updateHTML(): void {
    if (this.outputElement && this.titleInput && this.descriptionInput && this.authorInput) {
      const config: BoilerplateConfig = {
        title: getInputValue(this.titleInput),
        description: getInputValue(this.descriptionInput),
        author: getInputValue(this.authorInput),
      };
      const output = generateHTMLBoilerplate(config);
      this.outputElement.textContent = output;
    }
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}