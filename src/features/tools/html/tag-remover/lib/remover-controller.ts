import { HtmlTagRemover } from './tag-remover';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { TagRemoverElements, TagRemoverOptions } from '../types/remover';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlTagRemoverController extends BaseConverterController<TagRemoverElements> {
  private remover: HtmlTagRemover | null = null;

  constructor() {
    super('HtmlTagRemoverController');
    this.delayedInit();
  }

  protected getRequiredElementIds(): string[] {
    return ['htmlInput', 'textOutput'];
  }

  protected initializeElements(): TagRemoverElements {
    const createElement = <T extends HTMLElement>(tag: string): T =>
      document.createElement(tag) as T;

    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput') || createElement<HTMLTextAreaElement>('textarea'),
      textOutput: this.safeGetElement<HTMLTextAreaElement>('textOutput') || createElement<HTMLTextAreaElement>('textarea'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage') || createElement<HTMLElement>('div'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      options: {
        preserveText: this.safeGetElement<HTMLInputElement>('preserveTextOption') || createElement<HTMLInputElement>('input'),
        preserveWhitespace: this.safeGetElement<HTMLInputElement>('preserveWhitespaceOption') || createElement<HTMLInputElement>('input'),
        removeSpecificTags: this.safeGetElement<HTMLInputElement>('removeSpecificTagsOption') || createElement<HTMLInputElement>('input'),
        convertEntities: this.safeGetElement<HTMLInputElement>('convertEntitiesOption') || createElement<HTMLInputElement>('input'),
      },
      tagListInput: this.safeGetElement<HTMLInputElement>('tagListInput'),
      tagListPanel: this.safeGetElement<HTMLElement>('tagListPanel')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.performConversion();
      this.updateStats();
    });

    const convertBtn = this.safeGetElement('convertBtn');
    this.safeAddEventListener(convertBtn, 'click', () => this.performConversion());

    const clearBtn = this.safeGetElement('clearBtn');
    this.safeAddEventListener(clearBtn, 'click', () => this.clearAll('htmlInput', 'textOutput'));

    const copyBtn = this.safeGetElement('copyBtn');
    this.safeAddEventListener(copyBtn, 'click', () => this.handleCopy('textOutput', 'copyBtn'));

    const sampleBtn = this.safeGetElement('sampleBtn');
    this.safeAddEventListener(sampleBtn, 'click', () => this.loadSample());

    Object.values(this.elements.options).forEach(option => {
      if (option) {
        this.safeAddEventListener(option, 'change', () => {
          this.updateRemoverOptions();
          this.performConversion();
          this.updateTagListVisibility();
        });
      }
    });

    if (this.elements.tagListInput) {
      this.safeAddEventListener(this.elements.tagListInput, 'input', () => {
        this.updateRemoverOptions();
        this.performConversion();
      });
    }

    this.initializeRemover();
    this.updateTagListVisibility();
  }

  private initializeRemover(): void {
    const options = this.getOptions();
    this.remover = new HtmlTagRemover(options);
  }

  private getOptions(): TagRemoverOptions {
    if (!this.elements) {
      return {
        preserveText: true,
        preserveWhitespace: false,
        removeSpecificTags: false,
        convertEntities: true,
        tagList: []
      };
    }

    const tagList = this.elements.tagListInput?.value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0) || [];

    return {
      preserveText: this.elements.options.preserveText?.checked ?? true,
      preserveWhitespace: this.elements.options.preserveWhitespace?.checked ?? false,
      removeSpecificTags: this.elements.options.removeSpecificTags?.checked ?? false,
      convertEntities: this.elements.options.convertEntities?.checked ?? true,
      tagList: tagList
    };
  }

  private updateRemoverOptions(): void {
    const options = this.getOptions();
    if (this.remover) {
      this.remover.updateOptions(options);
    } else {
      this.remover = new HtmlTagRemover(options);
    }
  }

  private performConversion(): void {
    if (!this.elements?.htmlInput || !this.elements?.textOutput || !this.remover) return;

    const input = this.elements.htmlInput.value.trim();
    
    try {
      const result = input ? this.remover.removeTags(input) : '';
      this.elements.textOutput.value = result;
      this.updateStats();
      
      if (input && result) {
        this.showSuccess('HTML tags successfully removed!');
      }
    } catch (error) {
      console.error('Tag removal error:', error);
      this.showError(`Error removing tags: ${(error as Error).message}`);
      this.elements.textOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
      this.elements.htmlInput.value = this.getSampleInput();
      this.performConversion();
      this.updateStats();
    }
  }

  private updateStats(): void {
    if (!this.elements?.htmlInput || !this.elements?.textOutput) return;

    const inputValue = this.elements.htmlInput.value || '';
    const outputValue = this.elements.textOutput.value || '';

    const inputStats = this.calculateStats(inputValue);
    const outputStats = this.calculateStats(outputValue);

    if (this.elements.inputStats) {
      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    }

    if (this.elements.outputStats) {
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  private updateTagListVisibility(): void {
    if (!this.elements?.tagListPanel || !this.elements?.options?.removeSpecificTags) return;

    const isSpecificTagsMode = this.elements.options.removeSpecificTags.checked;
    
    if (isSpecificTagsMode) {
      this.elements.tagListPanel.style.display = 'block';
    } else {
      this.elements.tagListPanel.style.display = 'none';
    }
  }

  protected getSampleInput(): string {
    return `<div class="content">
  <h1>Sample HTML Document</h1>
  <p>This is a <strong>paragraph</strong> with <em>emphasis</em>.</p>
  <script>alert('This script will be removed');</script>
  <style>.hidden { display: none; }</style>
  <span>Some text with <a href="#link">a link</a>.</span>
  <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>
</div>`;
  }

  protected onInitialized(): void {
    this.updateStats();
    console.log('HTML Tag Remover initialized successfully');
  }
}