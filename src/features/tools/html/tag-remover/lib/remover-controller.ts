import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlTagRemoverElements } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlTagRemoverController extends BaseConverterController<HtmlTagRemoverElements> {
  
  protected initializeElements(): HtmlTagRemoverElements {
    return {
      htmlInput: this.safeGetElement<HTMLTextAreaElement>('htmlInput'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('htmlOutput'),
      convertBtn: this.safeGetElement<HTMLButtonElement>('convertBtn'),
      clearBtn: this.safeGetElement<HTMLButtonElement>('clearBtn'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      sampleBtn: this.safeGetElement<HTMLButtonElement>('sampleBtn'),
      tagListInput: this.safeGetElement<HTMLInputElement>('tagListInput'),
      tagListPanel: this.safeGetElement<HTMLElement>('tagListPanel'),
      inputCount: this.safeGetElement<HTMLSpanElement>('inputCount'),
      outputCount: this.safeGetElement<HTMLSpanElement>('outputCount'),
      errorMessage: this.safeGetElement<HTMLElement>('errorMessage'),
      successMessage: this.safeGetElement<HTMLElement>('successMessage')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    this.safeAddEventListener(this.elements.convertBtn, 'click', (e) => {
      e.preventDefault();
      this.removeTags();
    });

    this.safeAddEventListener(this.elements.clearBtn, 'click', (e) => {
      e.preventDefault();
      this.clear();
    });

    this.safeAddEventListener(this.elements.copyBtn, 'click', (e) => {
      e.preventDefault();
      this.copy();
    });

    this.safeAddEventListener(this.elements.sampleBtn, 'click', (e) => {
      e.preventDefault();
      this.loadSample();
    });

    this.safeAddEventListener(this.elements.htmlInput, 'input', () => {
      this.removeTags();
    });

    // Handle specific tags option
    const removeSpecificOption = this.safeGetElement<HTMLInputElement>('removeSpecificTagsOption');
    this.safeAddEventListener(removeSpecificOption, 'change', () => {
      this.toggleTagListPanel();
    });
  }

  protected updateStats(): void {
    if (!this.elements) return;

    const inputLength = this.elements.htmlInput?.value?.length || 0;
    const outputLength = this.elements.htmlOutput?.value?.length || 0;

    if (this.elements.inputCount) {
      this.elements.inputCount.textContent = inputLength.toString();
    }
    if (this.elements.outputCount) {
      this.elements.outputCount.textContent = outputLength.toString();
    }
  }

  protected getSampleInput(): string {
    return '<div class="container"><h1>Title</h1><p>This is a <strong>sample</strong> paragraph with <a href="#">links</a> and <em>emphasis</em>.</p></div>';
  }

  private removeTags(): void {
    if (!this.elements?.htmlInput || !this.elements?.htmlOutput) return;

    const input = this.elements.htmlInput.value;
    
    try {
      const cleaned = this.processHtml(input);
      this.elements.htmlOutput.value = cleaned;
      this.updateStats();
    } catch (error) {
      console.error('Tag removal error:', error);
      this.elements.htmlOutput.value = 'Error: Could not process HTML';
    }
  }

  private processHtml(html: string): string {
    let result = html;

    // Check options
    const preserveText = this.safeGetElement<HTMLInputElement>('preserveTextOption')?.checked ?? true;
    const preserveWhitespace = this.safeGetElement<HTMLInputElement>('preserveWhitespaceOption')?.checked ?? false;
    const removeSpecific = this.safeGetElement<HTMLInputElement>('removeSpecificTagsOption')?.checked ?? false;
    const convertEntities = this.safeGetElement<HTMLInputElement>('convertEntitiesOption')?.checked ?? true;

    if (removeSpecific && this.elements.tagListInput) {
      // Remove only specific tags
      const tags = this.elements.tagListInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tags.length > 0) {
        tags.forEach(tag => {
          const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gi');
          result = result.replace(regex, preserveText ? '$1' : '');
        });
      }
    } else {
      // Remove all HTML tags
      if (preserveText) {
        result = result.replace(/<[^>]*>/g, '');
      } else {
        result = result.replace(/<.*?>/g, '');
      }
    }

    // Convert HTML entities if requested
    if (convertEntities) {
      result = this.decodeHtmlEntities(result);
    }

    // Handle whitespace
    if (!preserveWhitespace) {
      result = result.replace(/\s+/g, ' ').trim();
    }

    return result;
  }

  private decodeHtmlEntities(str: string): string {
    const entityMap: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' '
    };

    return str.replace(/&[#\w]+;/g, (entity) => entityMap[entity] || entity);
  }

  private toggleTagListPanel(): void {
    if (!this.elements?.tagListPanel) return;

    const removeSpecificOption = this.safeGetElement<HTMLInputElement>('removeSpecificTagsOption');
    if (removeSpecificOption?.checked) {
      this.elements.tagListPanel.classList.remove('hidden');
    } else {
      this.elements.tagListPanel.classList.add('hidden');
    }
  }

  private clear(): void {
    if (!this.elements) return;
    
    if (this.elements.htmlInput) this.elements.htmlInput.value = '';
    if (this.elements.htmlOutput) this.elements.htmlOutput.value = '';
    this.updateStats();
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

  private loadSample(): void {
    if (!this.elements?.htmlInput) return;
    
    this.elements.htmlInput.value = this.getSampleInput();
    this.removeTags();
  }
}
