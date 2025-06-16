import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToPugElements, PugConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToPugConverterController extends BaseConverterController<HtmlToPugElements> {
  constructor() {
    super('HtmlToPugConverter');
    if (this.hasRequiredElements()) {
      this.delayedInit();
    }
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'pugOutput'];
  }

  protected initializeElements(): HtmlToPugElements {
    const createElement = <T extends HTMLElement>(tag: string): T =>
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      pugOutput: this.safeGetElement<HTMLTextAreaElement>('pugOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      copyButton: this.safeGetElement<HTMLButtonElement>('copyButton'),
      sampleButton: this.safeGetElement<HTMLButtonElement>('sampleButton'),
      statsContainer: this.safeGetElement<HTMLDivElement>('statsContainer')
    };
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }
}