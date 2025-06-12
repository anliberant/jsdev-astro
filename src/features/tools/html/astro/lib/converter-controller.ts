import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToAstroElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToAstroController extends BaseConverterController<HtmlToAstroElements> {
  private initAttempts: number = 0;
  private maxAttempts: number = 50;

  constructor() {
    super();
    this.delayedInit();
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
    console.log(`Astro Converter Attempt ${this.initAttempts}: Initializing...`);

    try {
      this.elements = this.initializeElements();
      
      if (this.validateElements()) {
        this.bindEvents();
        this.updateStats();
        console.log('Astro Converter initialized successfully');
      } else {
        throw new Error('Required elements not found');
      }
    } catch (error) {
      console.warn(`Astro Converter initialization attempt ${this.initAttempts} failed:`, error);
      
      if (this.initAttempts < this.maxAttempts) {
        setTimeout(() => this.attemptInit(), 100);
      } else {
        console.error('Failed to initialize Astro converter after maximum attempts');
      }
    }
  }

  protected initializeElements(): HtmlToAstroElements {
    const createElement = <T extends HTMLElement>(tag: string): T => 
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      astroOutput: this.safeGetElement<HTMLTextAreaElement>('astroOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats'),
    };
  }

  protected validateElements(): boolean {
    return !!(this.elements.htmlInput && this.elements.astroOutput);
  }

  protected bindEvents(): void {
    if (!this.validateElements()) {
      console.error('Cannot bind events: required elements not found');
      return;
    }

    // Main input event
    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.convert();
      this.updateStats();
    });

    // Action buttons
    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.convert());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clear());

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.copy());

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    console.log('Astro Converter events bound successfully');
  }

  protected convert(): void {
    if (!this.validateElements()) {
      console.warn('Cannot convert: elements not ready');
      return;
    }

    const html = this.elements.htmlInput.value?.trim() || '';

    if (!html) {
      this.elements.astroOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const astroCode = this.convertHtmlToAstro(html);
      this.elements.astroOutput.value = astroCode;
      this.showSuccess('HTML successfully converted to Astro!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements.astroOutput.value = '';
      this.updateStats();
    }
  }

  private convertHtmlToAstro(html: string): string {
    if (!html.trim()) return '';

    const isFullDocument =
      html.includes('<!DOCTYPE') || (html.includes('<html') && html.includes('<head'));

    if (isFullDocument) {
      // Extract head content
      const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      const headContent = headMatch ? headMatch[1].trim() : '';

      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

      // Extract title
      const titleMatch = headContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Astro Component';

      return `---
export interface Props {
  title?: string;
}

const { title = "${title}" } = Astro.props;
---

${bodyContent}`;
    } else {
      return `---
// Astro component
export interface Props {
  title?: string;
}

const { title = "Page Title" } = Astro.props;
---

${html}`;
    }
  }

  private loadSample(): void {
    if (this.elements.htmlInput) {
      const sampleHtml = `<div class="container">
  <header class="header">
    <h1>Welcome to Astro</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="#home" class="nav-link">Home</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <section class="hero">
      <h2>Hero Section</h2>
      <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <button type="submit" class="btn btn-primary">Click Me</button>
    </section>
  </main>
</div>`;

      this.elements.htmlInput.value = sampleHtml;
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'astroOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('astroOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements.inputStats && this.elements.outputStats) {
      const inputValue = this.elements.htmlInput?.value || '';
      const outputValue = this.elements.astroOutput?.value || '';

      const inputStats = this.calculateStats(inputValue);
      const outputStats = this.calculateStats(outputValue);

      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  protected showSuccess(message: string): void {
    if (this.elements.successMessage) {
      this.elements.successMessage.textContent = message;
      this.elements.successMessage.classList.remove('hidden');
    }
    if (this.elements.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
    if (this.elements.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }

  public isReady(): boolean {
    return this.validateElements();
  }
}