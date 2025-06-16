import { JsxConverter } from './jsx-converter';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToJsxElements, JsxConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToJsxConverterController extends BaseConverterController<HtmlToJsxElements> {
  private converter: JsxConverter | null = null;

  constructor() {
    super('HtmlToJsxConverter');
    if (this.hasRequiredElements()) {
      this.delayedInit();
    }
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'jsxOutput'];
  }

  protected initializeElements(): HtmlToJsxElements {
    const createElement = <T extends HTMLElement>(tag: string): T =>
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      jsxOutput: this.safeGetElement<HTMLTextAreaElement>('jsxOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLDivElement>('errorMessage'),
      copyButton: this.safeGetElement<HTMLButtonElement>('copyButton'),
      sampleButton: this.safeGetElement<HTMLButtonElement>('sampleButton'),
      statsContainer: this.safeGetElement<HTMLDivElement>('statsContainer')
    };
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }

  protected convert(input: string): string {
    this.converter = this.converter || new JsxConverter();
    return this.converter.convert(input);
  }
}