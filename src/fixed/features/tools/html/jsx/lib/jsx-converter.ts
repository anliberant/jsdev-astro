import type { JsxConversionOptions } from '@/shared/types';

export class JsxConverter {
  private options: JsxConversionOptions;
  private htmlToJsxMap: Record<string, string>;

  constructor(options: JsxConversionOptions) {
    this.options = options;
    this.htmlToJsxMap = this.getHtmlToJsxAttributeMap();
  }

  convertToJsx(html: string): string {
    if (!html.trim()) {
      return '';
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid HTML syntax');
    }

    const container = doc.body.firstChild as HTMLElement;
    let result = '';

    const childNodes = Array.from(container.childNodes).filter(node => {
      return (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      );
    });

    if (childNodes.length > 1 && this.options.useFragment) {
      result = '<>\n';
      for (const node of childNodes) {
        result += this.nodeToJsx(node, 1);
      }
      result += '</>';
    } else if (childNodes.length === 1) {
      result = this.nodeToJsx(childNodes[0], 0).trim();
    } else {
      for (const node of childNodes) {
        result += this.nodeToJsx(node, 0);
      }
    }

    return result.trim();
  }

  private nodeToJsx(node: Node, depth: number): string {
    const indent = this.options.prettify ? '  '.repeat(depth) : '';
    const newline = this.options.prettify ? '\n' : '';
    let result = '';

    if (node.nodeType === Node.ELEMENT_NODE) {
      result += this.elementToJsx(node as Element, depth);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        const escapedText = text.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
        result += indent + escapedText + newline;
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      result += indent + '{/* ' + node.textContent?.trim() + ' */}' + newline;
    }

    return result;
  }

  private elementToJsx(element: Element, depth: number): string {
    const indent = this.options.prettify ? '  '.repeat(depth) : '';
    const newline = this.options.prettify ? '\n' : '';
    const tagName = element.tagName.toLowerCase();

    const selfClosingTags = [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ];
    const isSelfClosing = selfClosingTags.includes(tagName);

    let result = indent + '<' + tagName;

    const attributes = this.getJsxAttributes(element);
    if (attributes.length > 0) {
      result += ' ' + attributes.join(' ');
    }

    if (isSelfClosing) {
      result += ' />' + newline;
    } else {
      result += '>';

      const hasChildren = element.childNodes.length > 0;

      if (hasChildren) {
        const childrenOnNewLine = this.shouldChildrenBeOnNewLine(element);

        if (childrenOnNewLine) {
          result += newline;
        }

        const childNodes = Array.from(element.childNodes);
        for (const child of childNodes) {
          if (childrenOnNewLine) {
            result += this.nodeToJsx(child, depth + 1);
          } else {
            result += this.nodeToJsx(child, 0).trim();
          }
        }

        if (childrenOnNewLine) {
          result += indent;
        }
      }

      result += '</' + tagName + '>' + newline;
    }

    return result;
  }

  private shouldChildrenBeOnNewLine(element: Element): boolean {
    if (!this.options.prettify) return false;

    const inlineElements = [
      'a',
      'span',
      'strong',
      'em',
      'b',
      'i',
      'code',
      'small',
      'sub',
      'sup',
    ];

    if (inlineElements.includes(element.tagName.toLowerCase())) {
      return false;
    }

    const childNodes = Array.from(element.childNodes);
    let hasOnlyText = true;

    for (const child of childNodes) {
      if (child.nodeType !== Node.TEXT_NODE) {
        hasOnlyText = false;
        break;
      }
    }

    return !hasOnlyText;
  }

  private getJsxAttributes(element: Element): string[] {
    const attributes: string[] = [];
    const elementAttributes = Array.from(element.attributes);

    for (const attr of elementAttributes) {
      let name = attr.name.toLowerCase();
      const value = attr.value;

      if (this.options.camelCase && this.htmlToJsxMap[name]) {
        name = this.htmlToJsxMap[name];
      }

      if (name === 'style' && value) {
        const styleObj = this.parseInlineStyles(value);
        attributes.push(`style={${styleObj}}`);
      } else if (value === '' || value === name) {
        attributes.push(name);
      } else if (name.startsWith('data-') || name.startsWith('aria-')) {
        attributes.push(`${name}="${value}"`);
      } else {
        attributes.push(`${name}="${value}"`);
      }
    }

    return attributes;
  }

  private parseInlineStyles(styleString: string): string {
    const styles: Record<string, string> = {};
    const declarations = styleString.split(';').filter(decl => decl.trim());

    for (const decl of declarations) {
      const [property, value] = decl.split(':').map(s => s.trim());

      if (property && value) {
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        styles[camelProperty] = value;
      }
    }

    return JSON.stringify(styles);
  }

  private getHtmlToJsxAttributeMap(): Record<string, string> {
    return {
      class: 'className',
      for: 'htmlFor',
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      maxlength: 'maxLength',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable',
      crossorigin: 'crossOrigin',
      datetime: 'dateTime',
      enctype: 'encType',
      formaction: 'formAction',
      formenctype: 'formEncType',
      formmethod: 'formMethod',
      formnovalidate: 'formNoValidate',
      formtarget: 'formTarget',
      marginheight: 'marginHeight',
      marginwidth: 'marginWidth',
      novalidate: 'noValidate',
      radiogroup: 'radioGroup',
      spellcheck: 'spellCheck',
      srcdoc: 'srcDoc',
      srclang: 'srcLang',
      srcset: 'srcSet',
    };
  }
}
