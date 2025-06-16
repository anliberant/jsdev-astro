import type { PugConversionOptions } from '@/shared/types';

export class HtmlParser {
  private options: PugConversionOptions;

  constructor(options: PugConversionOptions) {
    this.options = options;
  }

  convertToPug(html: string): string {
    const cleanHtml = this.cleanHtml(html);
    const doc = this.parseHtml(cleanHtml);

    if (this.hasParserError(doc)) {
      throw new Error('Invalid HTML syntax');
    }

    return this.processDocument(doc, cleanHtml);
  }

  private cleanHtml(html: string): string {
    return html.trim().replace(/<!DOCTYPE[^>]*>/i, '');
  }

  private parseHtml(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }

  private hasParserError(doc: Document): boolean {
    return !!doc.querySelector('parsererror');
  }

  private processDocument(doc: Document, cleanHtml: string): string {
    let result = '';

    if (doc.body && doc.body.children.length > 0) {
      const bodyNodes = Array.from(doc.body.childNodes);
      for (const node of bodyNodes) {
        result += this.nodeToPug(node, 0);
      }
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cleanHtml;
      const wrapperNodes = Array.from(wrapper.childNodes);
      for (const node of wrapperNodes) {
        result += this.nodeToPug(node, 0);
      }
    }

    return result.trim();
  }

  private nodeToPug(node: Node, depth: number): string {
    const indent = '  '.repeat(depth);
    let result = '';

    if (node.nodeType === Node.ELEMENT_NODE) {
      result += this.elementToPug(node as Element, depth);
    } else if (node.nodeType === Node.TEXT_NODE) {
      result += this.textNodeToPug(node, indent);
    } else if (
      node.nodeType === Node.COMMENT_NODE &&
      this.options.preserveComments
    ) {
      result += this.commentNodeToPug(node, indent);
    }

    return result;
  }

  private elementToPug(element: Element, depth: number): string {
    const indent = '  '.repeat(depth);
    const pugLine = this.buildPugLine(element);
    let result = indent + pugLine + '\n';

    const childNodes = Array.from(element.childNodes);
    for (const child of childNodes) {
      if (this.shouldSkipTextNode(child, element)) {
        continue;
      }
      result += this.nodeToPug(child, depth + 1);
    }

    return result;
  }

  private buildPugLine(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    let pugLine = tagName;

    if (element.id) {
      pugLine += '#' + element.id;
    }

    if (element.className && typeof element.className === 'string') {
      const classes = element.className
        .trim()
        .split(/\s+/)
        .filter(cls => cls);
      if (classes.length > 0) {
        pugLine += '.' + classes.join('.');
      }
    }

    const attributes = this.getAttributes(element);
    if (attributes.length > 0) {
      pugLine += '(' + attributes.join(', ') + ')';
    }

    const textContent = this.getDirectTextContent(element);
    if (
      textContent &&
      this.options.combineText &&
      element.children.length === 0
    ) {
      pugLine += ' ' + textContent;
    }

    return pugLine;
  }

  private textNodeToPug(node: Node, indent: string): string {
    const text = node.textContent?.trim();
    if (text) {
      if (
        this.options.combineText &&
        node.parentNode &&
        (node.parentNode as Element).children.length === 0
      ) {
        return '';
      }
      return indent + '| ' + text + '\n';
    }
    return '';
  }

  private commentNodeToPug(node: Node, indent: string): string {
    return indent + '// ' + (node.textContent?.trim() || '') + '\n';
  }

  private shouldSkipTextNode(child: Node, element: Element): boolean {
    return (
      child.nodeType === Node.TEXT_NODE &&
      this.options.combineText &&
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
}
