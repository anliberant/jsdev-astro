import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToAstroElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/lib/index';

export class HtmlToAstroController extends BaseConverterController<HtmlToAstroElements> {
  private initAttempts: number = 0;
  private maxAttempts: number = 50;

  constructor() {
    super();
    if (document.querySelector('#htmlInput') && document.querySelector('#astroOutput')) {
      this.delayedInit();
    }
  }

  private delayedInit(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attemptInit());
    } else {
      setTimeout(() => this.attemptInit(), 100);
    }
  }

  private attemptInit(): void {
    this.initAttempts++;
    try {
      this.elements = this.initializeElements();
      if (this.validateElements()) {
        this.bindEvents();
        this.updateStats();
      }
    } catch (e) {}
    if (this.initAttempts < this.maxAttempts && !this.elements) {
      setTimeout(() => this.attemptInit(), 100);
    }
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}