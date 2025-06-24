import { BaseConverterController } from '@/shared/lib/base-converter-controller';

interface IframeElements {
  iframePreview: HTMLElement | null;
  htmlOutput: HTMLTextAreaElement | null;
  copyBtn: HTMLButtonElement | null;
  srcInput: HTMLInputElement | null;
  widthInput: HTMLInputElement | null;
  heightInput: HTMLInputElement | null;
  titleInput: HTMLInputElement | null;
  allowFullscreenCheckbox: HTMLInputElement | null;
  loadingSelect: HTMLSelectElement | null;
  sandboxSelect: HTMLSelectElement | null;
}

export class HtmlIframeGeneratorController extends BaseConverterController<IframeElements> {
  
  protected initializeElements(): IframeElements {
    return {
      iframePreview: this.safeGetElement<HTMLElement>('iframePreview'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('htmlOutput'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      srcInput: this.safeGetElement<HTMLInputElement>('srcInput'),
      widthInput: this.safeGetElement<HTMLInputElement>('widthInput'),
      heightInput: this.safeGetElement<HTMLInputElement>('heightInput'),
      titleInput: this.safeGetElement<HTMLInputElement>('titleInput'),
      allowFullscreenCheckbox: this.safeGetElement<HTMLInputElement>('allowFullscreenCheckbox'),
      loadingSelect: this.safeGetElement<HTMLSelectElement>('loadingSelect'),
      sandboxSelect: this.safeGetElement<HTMLSelectElement>('sandboxSelect')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.srcInput, 'input', () => this.generateIframe());
    this.safeAddEventListener(this.elements.widthInput, 'input', () => this.generateIframe());
    this.safeAddEventListener(this.elements.heightInput, 'input', () => this.generateIframe());
    this.safeAddEventListener(this.elements.titleInput, 'input', () => this.generateIframe());
    this.safeAddEventListener(this.elements.allowFullscreenCheckbox, 'change', () => this.generateIframe());
    this.safeAddEventListener(this.elements.loadingSelect, 'change', () => this.generateIframe());
    this.safeAddEventListener(this.elements.sandboxSelect, 'change', () => this.generateIframe());

    this.safeAddEventListener(this.elements.copyBtn, 'click', (e) => {
      e.preventDefault();
      this.copy();
    });
  }

  protected updateStats(): void {
    // Iframe stats could be shown here
  }

  protected getSampleInput(): string {
    return '';
  }

  protected onReady(): void {
    this.generateIframe();
  }

  private generateIframe(): void {
    if (!this.elements) return;

    const src = this.elements.srcInput?.value || 'https://example.com';
    const width = this.elements.widthInput?.value || '600';
    const height = this.elements.heightInput?.value || '400';
    const title = this.elements.titleInput?.value || 'Embedded content';
    const allowFullscreen = this.elements.allowFullscreenCheckbox?.checked || false;
    const loading = this.elements.loadingSelect?.value || 'lazy';
    const sandbox = this.elements.sandboxSelect?.value || '';

    const iframeHtml = this.createIframeHtml(src, width, height, title, allowFullscreen, loading, sandbox);
    
    if (this.elements.iframePreview) {
      this.elements.iframePreview.innerHTML = iframeHtml;
    }
    
    if (this.elements.htmlOutput) {
      this.elements.htmlOutput.value = iframeHtml;
    }
  }

  private createIframeHtml(src: string, width: string, height: string, title: string, allowFullscreen: boolean, loading: string, sandbox: string): string {
    let attributes = [
      `src="${src}"`,
      `width="${width}"`,
      `height="${height}"`,
      `title="${title}"`
    ];

    if (loading !== 'auto') {
      attributes.push(`loading="${loading}"`);
    }

    if (allowFullscreen) {
      attributes.push('allowfullscreen');
    }

    if (sandbox) {
      attributes.push(`sandbox="${sandbox}"`);
    }

    // Add security attributes
    attributes.push('frameborder="0"');
    attributes.push('referrerpolicy="strict-origin-when-cross-origin"');

    return `<iframe ${attributes.join(' ')}></iframe>`;
  }

  private async copy(): void {
    if (!this.elements?.htmlOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
      this.showCopySuccess();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private showCopySuccess(): void {
    if (!this.elements?.copyBtn) return;
    
    const originalText = this.elements.copyBtn.textContent;
    this.elements.copyBtn.textContent = 'Copied!';
    
    setTimeout(() => {
      if (this.elements?.copyBtn && originalText) {
        this.elements.copyBtn.textContent = originalText;
      }
    }, 2000);
  }
}

---

// FILE: src/features/tools/html/boilerplate/lib/boilerplate-controller.ts
import { BaseConverterController } from '@/shared/lib/base-converter-controller';

interface BoilerplateElements {
  htmlOutput: HTMLTextAreaElement | null;
  copyBtn: HTMLButtonElement | null;
  titleInput: HTMLInputElement | null;
  descriptionInput: HTMLInputElement | null;
  authorInput: HTMLInputElement | null;
  keywordsInput: HTMLInputElement | null;
  viewportCheckbox: HTMLInputElement | null;
  charsetSelect: HTMLSelectElement | null;
  langSelect: HTMLSelectElement | null;
  includeStylesCheckbox: HTMLInputElement | null;
  includeScriptsCheckbox: HTMLInputElement | null;
  includeMetaCheckbox: HTMLInputElement | null;
}

export class HtmlBoilerplateController extends BaseConverterController<BoilerplateElements> {
  
  protected initializeElements(): BoilerplateElements {
    return {
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('htmlOutput'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      titleInput: this.safeGetElement<HTMLInputElement>('titleInput'),
      descriptionInput: this.safeGetElement<HTMLInputElement>('descriptionInput'),
      authorInput: this.safeGetElement<HTMLInputElement>('authorInput'),
      keywordsInput: this.safeGetElement<HTMLInputElement>('keywordsInput'),
      viewportCheckbox: this.safeGetElement<HTMLInputElement>('viewportCheckbox'),
      charsetSelect: this.safeGetElement<HTMLSelectElement>('charsetSelect'),
      langSelect: this.safeGetElement<HTMLSelectElement>('langSelect'),
      includeStylesCheckbox: this.safeGetElement<HTMLInputElement>('includeStylesCheckbox'),
      includeScriptsCheckbox: this.safeGetElement<HTMLInputElement>('includeScriptsCheckbox'),
      includeMetaCheckbox: this.safeGetElement<HTMLInputElement>('includeMetaCheckbox')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.titleInput, 'input', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.descriptionInput, 'input', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.authorInput, 'input', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.keywordsInput, 'input', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.viewportCheckbox, 'change', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.charsetSelect, 'change', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.langSelect, 'change', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.includeStylesCheckbox, 'change', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.includeScriptsCheckbox, 'change', () => this.generateBoilerplate());
    this.safeAddEventListener(this.elements.includeMetaCheckbox, 'change', () => this.generateBoilerplate());

    this.safeAddEventListener(this.elements.copyBtn, 'click', (e) => {
      e.preventDefault();
      this.copy();
    });
  }

  protected updateStats(): void {
    if (this.elements?.htmlOutput) {
      const length = this.elements.htmlOutput.value.length;
      // Could display character count somewhere
    }
  }

  protected getSampleInput(): string {
    return '';
  }

  protected onReady(): void {
    this.generateBoilerplate();
  }

  private generateBoilerplate(): void {
    if (!this.elements) return;

    const title = this.elements.titleInput?.value || 'Document Title';
    const description = this.elements.descriptionInput?.value || '';
    const author = this.elements.authorInput?.value || '';
    const keywords = this.elements.keywordsInput?.value || '';
    const charset = this.elements.charsetSelect?.value || 'UTF-8';
    const lang = this.elements.langSelect?.value || 'en';
    const includeViewport = this.elements.viewportCheckbox?.checked || true;
    const includeStyles = this.elements.includeStylesCheckbox?.checked || false;
    const includeScripts = this.elements.includeScriptsCheckbox?.checked || false;
    const includeMeta = this.elements.includeMetaCheckbox?.checked || true;

    const boilerplate = this.createBoilerplateHtml({
      title,
      description,
      author,
      keywords,
      charset,
      lang,
      includeViewport,
      includeStyles,
      includeScripts,
      includeMeta
    });
    
    if (this.elements.htmlOutput) {
      this.elements.htmlOutput.value = boilerplate;
    }
    
    this.updateStats();
  }

  private createBoilerplateHtml(config: any): string {
    let html = '<!DOCTYPE html>\n';
    html += `<html lang="${config.lang}">\n`;
    html += '<head>\n';
    html += `  <meta charset="${config.charset}">\n`;
    
    if (config.includeViewport) {
      html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    }
    
    html += `  <title>${config.title}</title>\n`;
    
    if (config.includeMeta) {
      if (config.description) {
        html += `  <meta name="description" content="${config.description}">\n`;
      }
      if (config.author) {
        html += `  <meta name="author" content="${config.author}">\n`;
      }
      if (config.keywords) {
        html += `  <meta name="keywords" content="${config.keywords}">\n`;
      }
      
      // Add common meta tags
      html += '  <meta name="robots" content="index, follow">\n';
      html += '  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n';
    }
    
    if (config.includeStyles) {
      html += '  <link rel="stylesheet" href="styles.css">\n';
    }
    
    html += '</head>\n';
    html += '<body>\n';
    html += '  <header>\n';
    html += '    <h1>Welcome to Your Website</h1>\n';
    html += '  </header>\n\n';
    html += '  <main>\n';
    html += '    <section>\n';
    html += '      <h2>Main Content</h2>\n';
    html += '      <p>Your content goes here...</p>\n';
    html += '    </section>\n';
    html += '  </main>\n\n';
    html += '  <footer>\n';
    html += '    <p>&copy; 2024 Your Website. All rights reserved.</p>\n';
    html += '  </footer>\n';
    
    if (config.includeScripts) {
      html += '\n  <script src="script.js"></script>\n';
    }
    
    html += '</body>\n';
    html += '</html>';
    
    return html;
  }

  private async copy(): void {
    if (!this.elements?.htmlOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
      this.showCopySuccess();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private showCopySuccess(): void {
    if (!this.elements?.copyBtn) return;
    
    const originalText = this.elements.copyBtn.textContent;
    this.elements.copyBtn.textContent = 'Copied!';
    
    setTimeout(() => {
      if (this.elements?.copyBtn && originalText) {
        this.elements.copyBtn.textContent = originalText;
      }
    }, 2000);
  }
}