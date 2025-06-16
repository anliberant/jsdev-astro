import { BaseConverterController } from '@/shared/lib/base-converter-controller';
import type { HtmlToPugElements, PugConversionOptions } from '@/shared/types';
import { SAMPLE_HTML } from '@/shared/utils';

export class HtmlToPugConverterController extends BaseConverterController<HtmlToPugElements> {

  constructor() {
    super();
  }

  // Define which elements this converter needs
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
      successMessage: this.safeGetElement<HTMLElement>('successMessage') || createElement<HTMLElement>('div'),
      inputStats: this.safeGetElement<HTMLElement>('inputStats') || createElement<HTMLElement>('div'),
      outputStats: this.safeGetElement<HTMLElement>('outputStats') || createElement<HTMLElement>('div'),
      options: {
        prettify: this.safeGetElement<HTMLInputElement>('prettifyOption') || createElement<HTMLInputElement>('input'),
        combineText: this.safeGetElement<HTMLInputElement>('combineTextOption') || createElement<HTMLInputElement>('input'),
        preserveComments: this.safeGetElement<HTMLInputElement>('preserveCommentsOption') || createElement<HTMLInputElement>('input'),
      },
    };
  }

  protected validateElements(): boolean {
    return !!(this.elements?.htmlInput && this.elements?.pugOutput);
  }

  protected bindEvents(): void {
    if (!this.validateElements()) {
      console.error('Cannot bind events: required elements not found');
      return;
    }

    // Main input event
    this.safeAddEventListener(this.elements!.htmlInput, 'input', () => {
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

    // Option change handlers
    if (this.elements!.options) {
      Object.values(this.elements!.options).forEach(option => {
        if (option && option.addEventListener) {
          this.safeAddEventListener(option, 'change', () => {
            this.convert();
          });
        }
      });
    }

    console.log('Pug Converter events bound successfully');
  }

  protected onInitialized(): void {
    // Update stats after initialization
    this.updateStats();
  }

  private getOptions(): PugConversionOptions {
    if (!this.elements?.options) {
      return {
        prettify: true,
        combineText: false,
        preserveComments: false,
      };
    }

    return {
      prettify: this.elements.options.prettify?.checked || false,
      combineText: this.elements.options.combineText?.checked || false,
      preserveComments: this.elements.options.preserveComments?.checked || false,
    };
  }

  protected convert(): void {
    if (!this.validateElements()) {
      console.warn('Cannot convert: elements not ready');
      return;
    }

    const html = this.elements!.htmlInput.value?.trim() || '';

    if (!html) {
      this.elements!.pugOutput.value = '';
      this.hideMessages();
      this.updateStats();
      return;
    }

    try {
      const pug = this.convertHtmlToPug(html);
      this.elements!.pugOutput.value = pug;
      this.showSuccess('HTML successfully converted to Pug!');
      this.updateStats();
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion error: ${(error as Error).message}`);
      this.elements!.pugOutput.value = '';
      this.updateStats();
    }
  }

  private convertHtmlToPug(html: string): string {
    const options = this.getOptions();
    
    try {
      const cleanHtml = html.trim().replace(/<!DOCTYPE[^>]*>/i, '');
      const doc = this.parseHtml(cleanHtml);

      if (this.hasParserError(doc)) {
        throw new Error('Invalid HTML syntax');
      }

      return this.processDocument(doc, cleanHtml, options);
    } catch (error) {
      console.error('Pug conversion error:', error);
      throw error;
    }
  }

  private parseHtml(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }

  private hasParserError(doc: Document): boolean {
    return !!doc.querySelector('parsererror');
  }

  private processDocument(doc: Document, cleanHtml: string, options: PugConversionOptions): string {
    let result = '';

    if (doc.body && doc.body.children.length > 0) {
      const bodyNodes = Array.from(doc.body.childNodes);
      for (const node of bodyNodes) {
        result += this.nodeToPug(node, 0, options);
      }
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cleanHtml;
      const wrapperNodes = Array.from(wrapper.childNodes);
      for (const node of wrapperNodes) {
        result += this.nodeToPug(node, 0, options);
      }
    }

    return result.trim();
  }

  private nodeToPug(node: Node, depth: number, options: PugConversionOptions): string {
    const indent = options.prettify ? '  '.repeat(depth) : '';
    let result = '';

    if (node.nodeType === Node.ELEMENT_NODE) {
      result += this.elementToPug(node as Element, depth, options);
    } else if (node.nodeType === Node.TEXT_NODE) {
      result += this.textNodeToPug(node, indent, options);
    } else if (node.nodeType === Node.COMMENT_NODE && options.preserveComments) {
      result += this.commentNodeToPug(node, indent);
    }

    return result;
  }

  private elementToPug(element: Element, depth: number, options: PugConversionOptions): string {
    const indent = options.prettify ? '  '.repeat(depth) : '';
    const pugLine = this.buildPugLine(element, options);
    let result = indent + pugLine + '\n';

    const childNodes = Array.from(element.childNodes);
    for (const child of childNodes) {
      if (this.shouldSkipTextNode(child, element, options)) {
        continue;
      }
      result += this.nodeToPug(child, depth + 1, options);
    }

    return result;
  }

  private buildPugLine(element: Element, options: PugConversionOptions): string {
    const tagName = element.tagName.toLowerCase();
    let pugLine = tagName;

    if (element.id) {
      pugLine += '#' + element.id;
    }

    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/).filter(cls => cls);
      if (classes.length > 0) {
        pugLine += '.' + classes.join('.');
      }
    }

    const attributes = this.getAttributes(element);
    if (attributes.length > 0) {
      pugLine += '(' + attributes.join(', ') + ')';
    }

    const textContent = this.getDirectTextContent(element);
    if (textContent && options.combineText && element.children.length === 0) {
      pugLine += ' ' + textContent;
    }

    return pugLine;
  }

  private textNodeToPug(node: Node, indent: string, options: PugConversionOptions): string {
    const text = node.textContent?.trim();
    if (text) {
      if (options.combineText && node.parentNode && (node.parentNode as Element).children.length === 0) {
        return '';
      }
      return indent + '| ' + text + '\n';
    }
    return '';
  }

  private commentNodeToPug(node: Node, indent: string): string {
    return indent + '// ' + (node.textContent?.trim() || '') + '\n';
  }

  private shouldSkipTextNode(child: Node, element: Element, options: PugConversionOptions): boolean {
    return (
      child.nodeType === Node.TEXT_NODE &&
      options.combineText &&
      element.children.length === 0
    );
  }

  private getDirectTextContent(element: Element): string {
    let textContent = '';
    const childNodes = Array.from(element.childNodes);
    for (const child of childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        textContent += child.textContent;
      }
    }
    return textContent.trim();
  }

  private getAttributes(element: Element): string[] {
    const attributes: string[] = [];
    const skipAttributes = ['id', 'class'];
    const elementAttributes = Array.from(element.attributes);

    for (const attr of elementAttributes) {
      if (!skipAttributes.includes(attr.name)) {
        const attrName = attr.name;
        const attrValue = attr.value;

        if (attrValue === '' || attrValue === attrName) {
          attributes.push(attrName);
        } else {
          const escapedValue = attrValue.replace(/"/g, '\\"');
          attributes.push(`${attrName}="${escapedValue}"`);
        }
      }
    }

    return attributes;
  }

  private loadSample(): void {
    if (this.elements?.htmlInput) {
      this.elements.htmlInput.value = SAMPLE_HTML.pug;
      this.convert();
      this.updateStats();
    }
  }

  private clear(): void {
    this.clearAll('htmlInput', 'pugOutput');
    this.updateStats();
  }

  private async copy(): Promise<void> {
    await this.handleCopy('pugOutput', 'copyBtn');
  }

  private updateStats(): void {
    if (this.elements?.inputStats && this.elements?.outputStats) {
      const inputStats = this.calculateStats(this.elements.htmlInput?.value || '');
      const outputStats = this.calculateStats(this.elements.pugOutput?.value || '');

      this.elements.inputStats.textContent = `Lines: ${inputStats.lines}, Characters: ${inputStats.characters}`;
      this.elements.outputStats.textContent = `Lines: ${outputStats.lines}, Characters: ${outputStats.characters}`;
    }
  }

  protected showSuccess(message: string): void {
    if (this.elements?.successMessage) {
      this.elements.successMessage.textContent = message;
      this.elements.successMessage.classList.remove('hidden');
    }
    if (this.elements?.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 3000);
  }

  protected showError(message: string): void {
    if (this.elements?.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
    if (this.elements?.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
    
    setTimeout(() => {
      this.hideMessages();
    }, 5000);
  }

  // Public method to check if converter is ready
  public isReady(): boolean {
    return this.validateElements();
  }
}