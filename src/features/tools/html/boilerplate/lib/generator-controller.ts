import { generateHTMLBoilerplate } from './html-generator';
import type { BoilerplateConfig } from '@/shared/types';
import {
  copyToClipboard,
  getElementById,
  getInputValue,
  setTextContent,
  temporaryButtonText,
} from '@/shared/utils';

export class BoilerplateGeneratorController {
  private titleInput: HTMLInputElement | null = null;
  private descriptionInput: HTMLTextAreaElement | null = null;
  private authorInput: HTMLInputElement | null = null;
  private generateBtn: HTMLButtonElement | null = null;
  private copyBtn: HTMLButtonElement | null = null;
  private outputElement: HTMLElement | null = null;

  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.updateHTML(); 
  }

  private initializeElements(): void {
    this.titleInput = getElementById<HTMLInputElement>('title');
    this.descriptionInput = getElementById<HTMLTextAreaElement>('description');
    this.authorInput = getElementById<HTMLInputElement>('author');
    this.generateBtn = getElementById<HTMLButtonElement>('generate');
    this.copyBtn = getElementById<HTMLButtonElement>('copy');
    this.outputElement = getElementById('output');
  }

  private bindEvents(): void {
    this.titleInput?.addEventListener('input', () => this.updateHTML());
    this.descriptionInput?.addEventListener('input', () => this.updateHTML());
    this.authorInput?.addEventListener('input', () => this.updateHTML());

    this.generateBtn?.addEventListener('click', () => this.updateHTML());
    this.copyBtn?.addEventListener('click', () => this.copyHTML());
  }

  private getConfig(): BoilerplateConfig {
    return {
      title: getInputValue('title') || 'My Website',
      description: getInputValue('description'),
      author: getInputValue('author'),
    };
  }

  private updateHTML(): void {
    const config = this.getConfig();
    const html = generateHTMLBoilerplate(config);
    setTextContent('output', html);
  }

  private async copyHTML(): Promise<void> {
    const text = this.outputElement?.textContent || '';
    const success = await copyToClipboard(text);

    if (success && this.copyBtn) {
      temporaryButtonText(this.copyBtn, '✅ Copied!', 'Copy to Clipboard');
    } else if (this.copyBtn) {
      temporaryButtonText(this.copyBtn, '❌ Failed', 'Copy to Clipboard');
    }
  }
}
