import { HtmlTagRemover } from './tag-remover';
import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { TagRemoverElements, TagRemoverOptions } from '../types/remover';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlTagRemoverController extends BaseConverterController<TagRemoverElements> {
  private remover: HtmlTagRemover;

  constructor() {
    super();
    this.remover = new HtmlTagRemover(this.getOptions());
    this.updateStats();
    this.updateTagListVisibility();
  }

  protected initializeElements(): TagRemoverElements {
    return {
      htmlInput: document.getElementById('htmlInput') as HTMLTextAreaElement,
      textOutput: document.getElementById('textOutput') as HTMLTextAreaElement,
      errorMessage: document.getElementById('errorMessage') as HTMLElement,
      successMessage: document.getElementById('successMessage') as HTMLElement,
      inputStats: document.getElementById('inputStats') as HTMLElement,
      outputStats: document.getElementById('outputStats') as HTMLElement,
      options: {
        preserveText: document.getElementById('preserveTextOption') as HTMLInputElement,
        preserveWhitespace: document.getElementById('preserveWhitespaceOption') as HTMLInputElement,
        removeSpecificTags: document.getElementById('removeSpecificTagsOption') as HTMLInputElement,
        convertEntities: document.getElementById('convertEntitiesOption') as HTMLInputElement,
      },
      tagListInput: document.getElementById('tagListInput') as HTMLInputElement,
    };
  }

  protected bindEvents(): void {
    this.elements.htmlInput.addEventListener('input', () => {
      this.convert();
      this.updateStats();
    });

    document.getElementById('convertBtn')?.addEventListener('click', () => this.convert());
    document.getElementById('clearBtn')?.addEventListener('click', () => this.clear());
    document.getElementById('copyBtn')?.addEventListener('click', () => this.copy());
    document.getElementById('sampleBtn')?.addEventListener('click', () => this.loadSample());

    // Option change handlers
    Object.values(this.elements.options).forEach(option => {
      option.addEventListener('change', () => {
        this.remover.updateOptions(this.getOptions());
        this.updateTagListVisibility();
        this.convert();
      });
    });

    // Tag list input handler
    this.elements.tagListInput?.addEventListener('input', () => {
      this.remover.updateOptions(this.getOptions());
      this.convert();
    });
  }

  private getOptions(): TagRemoverOptions {
    const tagListValue = this.elements.tagListInput?.value || '';
    const tagList = tagListValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    return {
      preserveText: this.elements.options.preserveText.checked,
      preserveWhitespace: this.elements.options.preserveWhitespace.checked,
      removeSpecificTags: this.elements.options.removeSpecificTags.checked,
      convertEntities: this.elements.options.convertEntities.checked,
      tagList: tagList.length > 0 ? tagList : undefined,
    };
  }

  private updateTagListVisibility(): void {
    const tagListContainer = document.getElementById('tagListContainer');
    if (tagListContainer) {
      tagListContainer.style.display = 
        this.elements.options.removeSpecificTags.checked ? 'block' : 'none';
    }
  }

  protected convert(): void {
    const html = this.elements.htmlInput.value.trim();

    if (!html) {
      this.elements.textOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const text = this.remover.removeTags(html);
      this.elements.textOutput.value = text;
      this.showSuccess('HTML tags successfully removed!');
      this.updateStats();
    } catch (error) {
      console.error('Removal error:', error);
      this.showError(`Removal error: ${(error as Error).message}`);
      this.elements.textOutput.value = '';
      this.updateStats();
    }
  }

  private loadSample(): void {
    this.elements.htmlInput.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample HTML Document</title>
    <style>
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to Our Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="content">
            <h2>Main Content</h2>
            <p>This is a <strong>sample paragraph</strong> with <em>various HTML tags</em>.</p>
            <p>It includes <span class="highlight">highlighted text</span> and <a href="https://example.com">links</a>.</p>
            
            <blockquote>
                This is an important quote that contains valuable information.
            </blockquote>
            
            <div class="code-example">
                <pre><code>function example() {
    return "Hello, World!";
}</code></pre>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Sample Website. All rights reserved.</p>
    </footer>
</body>
</html>`;

    this.convert();
    this.updateStats();
  }

  private clear(): void {
    this.clearAll('htmlInput', 'textOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('textOutput', 'copyBtn');
  }

  private updateStats(): void {
    const inputStats = this.calculateStats(this.elements.htmlInput.value);
    const outputStats = this.calculateStats(this.elements.textOutput.value);

    this.elements.inputStats.textContent = 
      `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
    this.elements.outputStats.textContent = 
      `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
  }

  protected showSuccess(message: string): void {
    this.elements.successMessage.textContent = message;
    this.elements.successMessage.classList.remove('hidden');
    this.elements.errorMessage.classList.add('hidden');
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
    this.elements.successMessage.classList.add('hidden');
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }
}