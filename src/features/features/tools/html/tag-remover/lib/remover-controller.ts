import { HtmlTagRemover } from './tag-remover';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { TagRemoverElements, TagRemoverOptions } from '../types/remover';
import { SAMPLE_HTML } from '@/shared/lib/index';

export class HtmlTagRemoverController extends BaseConverterController<TagRemoverElements> {
  private remover: HtmlTagRemover;

  constructor() {
    super();
    if (document.querySelector('#htmlInput') && document.querySelector('#textOutput')) {
      this.elements = this.initializeElements();
      this.remover = new HtmlTagRemover(this.getOptions());
      this.updateStats();
      this.updateTagListVisibility();
    }
  }

  protected initializeElements(): TagRemoverElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      textOutput: document.getElementById('textOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      copyButton: document.getElementById('copyButton') as HTMLButtonElement,
      removeButton: document.getElementById('removeButton') as HTMLButtonElement,
      tagListPanel: document.getElementById('tagListPanel') as HTMLElement
    };
  }

  protected getOptions(): TagRemoverOptions {
    return {
      tagsToRemove: ['script', 'style']
    };
  }

  protected getSampleInput(): string {
    return SAMPLE_HTML;
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}