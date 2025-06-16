import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import { SAMPLE_HTML } from '@/shared/lib/index';

interface HtmlToJsxElements {
  htmlInput: HTMLTextAreaElement;
  jsxOutput: HTMLTextAreaElement;
  convertBtn: HTMLButtonElement;
  clearBtn: HTMLButtonElement;
  copyBtn: HTMLButtonElement;
  sampleBtn: HTMLButtonElement;
}

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'jsxOutput', 'convertBtn', 'clearBtn', 'copyBtn', 'sampleBtn'];
  }

  protected initializeElements(): HtmlToJsxElements {
    return {
      htmlInput: this.safeGetElement('htmlInput')!,
      jsxOutput: this.safeGetElement('jsxOutput')!,
      convertBtn: this.safeGetElement('convertBtn')!,
      clearBtn: this.safeGetElement('clearBtn')!,
      copyBtn: this.safeGetElement('copyBtn')!,
      sampleBtn: this.safeGetElement('sampleBtn')!,
    };
  }

  protected bindEvents(): void {
    this.safeAddEventListener(this.elements?.convertBtn, 'click', () => this.convert());
    this.safeAddEventListener(this.elements?.clearBtn, 'click', () => this.clearAll('htmlInput', 'jsxOutput'));
    this.safeAddEventListener(this.elements?.copyBtn, 'click', () => this.handleCopy('jsxOutput', 'copyBtn'));
    this.safeAddEventListener(this.elements?.sampleBtn, 'click', () => this.loadSample());
    this.safeAddEventListener(this.elements?.htmlInput, 'input', () => this.convert());
    console.log('bindEvents called');
  }

  private convert(): void {
    const html = this.elements?.htmlInput.value || '';
    const options = this.getOptions();
    let jsx = this.transformHtmlToJsx(html, options);
  
    if (options.prettify) {
      jsx = this.prettifyJsx(jsx);
    }
  
    this.elements!.jsxOutput.value = this.prettifyJsx(jsx);
  }
  

  private transformHtmlToJsx(html: string): string {
    return html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=');
  }

  private loadSample(): void {
    if (!this.elements) return;
    this.elements.htmlInput.value = SAMPLE_HTML.jsx;
    this.convert();
  }

  private getOptions(): { prettify: boolean; camelCase: boolean; fragment: boolean } {
    return {
      prettify: (document.getElementById('prettifyOption') as HTMLInputElement)?.checked ?? false,
      camelCase: (document.getElementById('camelCaseOption') as HTMLInputElement)?.checked ?? false,
      fragment: (document.getElementById('fragmentOption') as HTMLInputElement)?.checked ?? false,
    };
  }
  

  private prettifyJsx(code: string): string {
    try {
      return window.prettier.format(code, {
        parser: "babel",
        plugins: window.prettierPlugins,
        semi: true,
        singleQuote: true,
      });
    } catch {
      return code;
    }
  }

}