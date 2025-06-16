import { HtmlMarkdownConverter } from './html-to-markdown-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlMarkdownElements, ConversionMode } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlMarkdownController extends BaseConverterController<HtmlMarkdownElements> {
  private converter: HtmlMarkdownConverter | null = null;
  private currentMode: ConversionMode = 'html-to-markdown';
  private initAttempts: number = 0;
  private maxAttempts: number = 20;

  constructor() {
    super();
    if (document.querySelector('#htmlInput') && document.querySelector('#markdownOutput')) {
      this.elements = this.initializeElements();
      this.delayedInit();
    }
  }

  private delayedInit(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      setTimeout(() => this.attemptInit(), 50);
    }
  }

  private attemptInit(): void {
    this.initAttempts++;
    if (this.checkRequiredElements()) {
      this.bindEvents();
      this.updateStats();
    } else if (this.initAttempts < this.maxAttempts) {
      setTimeout(() => this.attemptInit(), 50);
    }
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }
}