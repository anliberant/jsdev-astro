import type { EncoderOptions } from '@/shared/types';

export class HtmlEncoderDecoder {
  private options: EncoderOptions;
  private htmlEntities: Record<string, string>;
  private reverseEntities: Record<string, string>;

  constructor(options: EncoderOptions) {
    this.options = options;
    this.htmlEntities = this.getHtmlEntitiesMap();
    this.reverseEntities = this.getReverseEntitiesMap();
  }

  encode(text: string): string {
    if (!text.trim()) {
      return '';
    }

    let encoded = text;

    // Basic HTML character encoding
    encoded = encoded.replace(/&/g, '&amp;');
    encoded = encoded.replace(/</g, '&lt;');
    encoded = encoded.replace(/>/g, '&gt;');
    encoded = encoded.replace(/"/g, '&quot;');
    encoded = encoded.replace(/'/g, '&#39;');

    if (this.options.specialChars) {
      // Encode special characters
      for (const [char, entity] of Object.entries(this.htmlEntities)) {
        if (char !== '&' && char !== '<' && char !== '>' && char !== '"' && char !== "'") {
          if (this.options.numericEntities) {
            // Convert to numeric entities
            encoded = encoded.replace(new RegExp(this.escapeRegExp(char), 'g'), `&#${char.charCodeAt(0)};`);
          } else {
            encoded = encoded.replace(new RegExp(this.escapeRegExp(char), 'g'), entity);
          }
        }
      }

      // Encode non-ASCII characters
      encoded = encoded.replace(/[\u0080-\uFFFF]/g, (match) => {
        return this.options.numericEntities ? 
          `&#${match.charCodeAt(0)};` : 
          this.htmlEntities[match] || `&#${match.charCodeAt(0)};`;
      });
    }

    return this.options.prettyFormat ? this.formatOutput(encoded) : encoded;
  }

  decode(text: string): string {
    if (!text.trim()) {
      return '';
    }

    let decoded = text;

    // Decode numeric entities (decimal)
    decoded = decoded.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });

    // Decode numeric entities (hexadecimal)
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });

    // Decode named entities
    for (const [entity, char] of Object.entries(this.reverseEntities)) {
      decoded = decoded.replace(new RegExp(this.escapeRegExp(entity), 'g'), char);
    }

    return this.options.prettyFormat ? this.formatOutput(decoded) : decoded;
  }

  private getHtmlEntitiesMap(): Record<string, string> {
    return {
      ' ': '&nbsp;',
      '¡': '&iexcl;',
      '¢': '&cent;',
      '£': '&pound;',
      '¤': '&curren;',
      '¥': '&yen;',
      '¦': '&brvbar;',
      '§': '&sect;',
      '¨': '&uml;',
      '©': '&copy;',
      'ª': '&ordf;',
      '«': '&laquo;',
      '¬': '&not;',
      '­': '&shy;',
      '®': '&reg;',
      '¯': '&macr;',
      '°': '&deg;',
      '±': '&plusmn;',
      '²': '&sup2;',
      '³': '&sup3;',
      '´': '&acute;',
      'µ': '&micro;',
      '¶': '&para;',
      '·': '&middot;',
      '¸': '&cedil;',
      '¹': '&sup1;',
      'º': '&ordm;',
      '»': '&raquo;',
      '¼': '&frac14;',
      '½': '&frac12;',
      '¾': '&frac34;',
      '¿': '&iquest;',
      'À': '&Agrave;',
      'Á': '&Aacute;',
      'Â': '&Acirc;',
      'Ã': '&Atilde;',
      'Ä': '&Auml;',
      'Å': '&Aring;',
      'Æ': '&AElig;',
      'Ç': '&Ccedil;',
      'È': '&Egrave;',
      'É': '&Eacute;',
      'Ê': '&Ecirc;',
      'Ë': '&Euml;',
      'Ì': '&Igrave;',
      'Í': '&Iacute;',
      'Î': '&Icirc;',
      'Ï': '&Iuml;',
      'Ð': '&ETH;',
      'Ñ': '&Ntilde;',
      'Ò': '&Ograve;',
      'Ó': '&Oacute;',
      'Ô': '&Ocirc;',
      'Õ': '&Otilde;',
      'Ö': '&Ouml;',
      '×': '&times;',
      'Ø': '&Oslash;',
      'Ù': '&Ugrave;',
      'Ú': '&Uacute;',
      'Û': '&Ucirc;',
      'Ü': '&Uuml;',
      'Ý': '&Yacute;',
      'Þ': '&THORN;',
      'ß': '&szlig;',
      'à': '&agrave;',
      'á': '&aacute;',
      'â': '&acirc;',
      'ã': '&atilde;',
      'ä': '&auml;',
      'å': '&aring;',
      'æ': '&aelig;',
      'ç': '&ccedil;',
      'è': '&egrave;',
      'é': '&eacute;',
      'ê': '&ecirc;',
      'ë': '&euml;',
      'ì': '&igrave;',
      'í': '&iacute;',
      'î': '&icirc;',
      'ï': '&iuml;',
      'ð': '&eth;',
      'ñ': '&ntilde;',
      'ò': '&ograve;',
      'ó': '&oacute;',
      'ô': '&ocirc;',
      'õ': '&otilde;',
      'ö': '&ouml;',
      '÷': '&divide;',
      'ø': '&oslash;',
      'ù': '&ugrave;',
      'ú': '&uacute;',
      'û': '&ucirc;',
      'ü': '&uuml;',
      'ý': '&yacute;',
      'þ': '&thorn;',
      'ÿ': '&yuml;',
      // Math symbols
      '∀': '&forall;',
      '∂': '&part;',
      '∃': '&exist;',
      '∅': '&empty;',
      '∇': '&nabla;',
      '∈': '&isin;',
      '∉': '&notin;',
      '∋': '&ni;',
      '∏': '&prod;',
      '∑': '&sum;',
      '−': '&minus;',
      '∗': '&lowast;',
      '√': '&radic;',
      '∝': '&prop;',
      '∞': '&infin;',
      '∠': '&ang;',
      '∧': '&and;',
      '∨': '&or;',
      '∩': '&cap;',
      '∪': '&cup;',
      '∫': '&int;',
      '∴': '&there4;',
      '∼': '&sim;',
      '≅': '&cong;',
      '≈': '&asymp;',
      '≠': '&ne;',
      '≡': '&equiv;',
      '≤': '&le;',
      '≥': '&ge;',
      '⊂': '&sub;',
      '⊃': '&sup;',
      '⊄': '&nsub;',
      '⊆': '&sube;',
      '⊇': '&supe;',
      '⊕': '&oplus;',
      '⊗': '&otimes;',
      '⊥': '&perp;',
      '⋅': '&sdot;',
      // Arrows
      '←': '&larr;',
      '↑': '&uarr;',
      '→': '&rarr;',
      '↓': '&darr;',
      '↔': '&harr;',
      '↵': '&crarr;',
      '⇐': '&lArr;',
      '⇑': '&uArr;',
      '⇒': '&rArr;',
      '⇓': '&dArr;',
      '⇔': '&hArr;',
      // Currency
      '€': '&euro;',
      '₹': '&#8377;',
      '₽': '&#8381;',
      '₩': '&#8361;',
      '₪': '&#8362;',
    };
  }

  private getReverseEntitiesMap(): Record<string, string> {
    const reverse: Record<string, string> = {};
    
    // Basic entities
    reverse['&amp;'] = '&';
    reverse['&lt;'] = '<';
    reverse['&gt;'] = '>';
    reverse['&quot;'] = '"';
    reverse['&#39;'] = "'";

    // Add all other entities
    for (const [char, entity] of Object.entries(this.htmlEntities)) {
      reverse[entity] = char;
    }

    return reverse;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private formatOutput(text: string): string {
    if (!this.options.prettyFormat) {
      return text;
    }

    // Add line breaks for better readability if the text is long
    if (text.length > 100) {
      // Add line breaks after entities for better readability
      return text.replace(/(&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;)/g, '$1\n');
    }

    return text;
  }
}