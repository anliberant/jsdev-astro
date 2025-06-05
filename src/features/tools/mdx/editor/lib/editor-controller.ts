export interface MdxEditorElements {
  editor: HTMLTextAreaElement;
  preview: HTMLElement;
  htmlOutput: HTMLElement;
  fileName: HTMLInputElement;
  tabs: NodeListOf<HTMLButtonElement>;
  editorPane: HTMLElement;
  previewPane: HTMLElement;
  htmlPane: HTMLElement;
  copyHtmlBtn: HTMLButtonElement;
}

export interface EditorState {
  activeTab: 'edit' | 'preview' | 'html' | 'split';
  showButton: boolean;
}

export class MdxEditorController {
  private elements: MdxEditorElements;
  private state: EditorState;

  constructor() {
    this.state = {
      activeTab: 'split',
      showButton: false,
    };
    this.initializeElements();
    this.initEventListeners();
    this.updatePreview();
  }

  private initializeElements(): void {
    this.elements = {
      editor: document.getElementById('editor') as HTMLTextAreaElement,
      preview: document.getElementById('preview') as HTMLElement,
      htmlOutput: document.getElementById('htmlOutput') as HTMLElement,
      fileName: document.getElementById('fileName') as HTMLInputElement,
      tabs: document.querySelectorAll(
        '.tab-button'
      ) as NodeListOf<HTMLButtonElement>,
      editorPane: document.getElementById('editorPane') as HTMLElement,
      previewPane: document.getElementById('previewPane') as HTMLElement,
      htmlPane: document.getElementById('htmlPane') as HTMLElement,
      copyHtmlBtn: document.getElementById('copyHtmlBtn') as HTMLButtonElement,
    };
  }

  private initEventListeners(): void {
    this.elements.tabs.forEach(button => {
      button.addEventListener('click', e => {
        const target = e.target as HTMLButtonElement;
        this.switchTab(target.dataset.tab as any);
      });
    });

    this.elements.editor.addEventListener('input', () => {
      this.updatePreview();
    });

    document.getElementById('exportBtn')?.addEventListener('click', () => {
      this.exportFile();
    });

    document.getElementById('fileImport')?.addEventListener('change', e => {
      this.importFile(e as Event);
    });

    this.initToolbarButtons();

    this.elements.editor.addEventListener('keydown', e => {
      this.handleKeydown(e);
    });

    this.elements.copyHtmlBtn.addEventListener('click', () => {
      this.copyHtmlToClipboard();
    });
  }

  private initToolbarButtons(): void {
    document.getElementById('boldBtn')?.addEventListener('click', () => {
      this.wrapSelection('**', '**');
    });

    document.getElementById('italicBtn')?.addEventListener('click', () => {
      this.wrapSelection('*', '*');
    });

    document.getElementById('codeBtn')?.addEventListener('click', () => {
      this.wrapSelection('`', '`');
    });

    document.getElementById('strikeBtn')?.addEventListener('click', () => {
      this.wrapSelection('~~', '~~');
    });

    document.getElementById('h1Btn')?.addEventListener('click', () => {
      this.addLinePrefix('# ');
    });

    document.getElementById('h2Btn')?.addEventListener('click', () => {
      this.addLinePrefix('## ');
    });

    document.getElementById('h3Btn')?.addEventListener('click', () => {
      this.addLinePrefix('### ');
    });

    document.getElementById('listBtn')?.addEventListener('click', () => {
      this.addLinePrefix('- ');
    });

    document.getElementById('orderedListBtn')?.addEventListener('click', () => {
      this.addNumberedList();
    });

    document.getElementById('checklistBtn')?.addEventListener('click', () => {
      this.addLinePrefix('- [ ] ');
    });

    document.getElementById('quoteBtn')?.addEventListener('click', () => {
      this.addLinePrefix('> ');
    });

    document.getElementById('linkBtn')?.addEventListener('click', () => {
      this.insertLink();
    });

    document.getElementById('imageBtn')?.addEventListener('click', () => {
      this.insertImage();
    });

    document.getElementById('codeBlockBtn')?.addEventListener('click', () => {
      this.insertCodeBlock();
    });

    document.getElementById('tableBtn')?.addEventListener('click', () => {
      this.insertTable();
    });

    document.getElementById('hrBtn')?.addEventListener('click', () => {
      this.insertAtCursor('\n\n---\n\n');
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          this.wrapSelection('**', '**');
          break;
        case 'i':
          e.preventDefault();
          this.wrapSelection('*', '*');
          break;
        case '`':
          e.preventDefault();
          this.wrapSelection('`', '`');
          break;
        case 'k':
          e.preventDefault();
          this.insertLink();
          break;
      }
    }
  }

  private wrapSelection(before: string, after: string): void {
    const start = this.elements.editor.selectionStart;
    const end = this.elements.editor.selectionEnd;
    const selectedText = this.elements.editor.value.substring(start, end);
    const replacement = before + selectedText + after;

    this.elements.editor.setRangeText(replacement, start, end, 'end');
    this.elements.editor.focus();
    this.updatePreview();
  }

  private addLinePrefix(prefix: string): void {
    const start = this.elements.editor.selectionStart;
    const value = this.elements.editor.value;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;

    const currentLine = value.substring(lineStart, actualLineEnd);

    if (currentLine.startsWith(prefix)) {
      const newLine = currentLine.substring(prefix.length);
      this.elements.editor.setRangeText(
        newLine,
        lineStart,
        actualLineEnd,
        'end'
      );
    } else {
      const newLine = prefix + currentLine;
      this.elements.editor.setRangeText(
        newLine,
        lineStart,
        actualLineEnd,
        'end'
      );
    }

    this.elements.editor.focus();
    this.updatePreview();
  }

  private addNumberedList(): void {
    const start = this.elements.editor.selectionStart;
    const value = this.elements.editor.value;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;

    const currentLine = value.substring(lineStart, actualLineEnd);

    const numberedMatch = currentLine.match(/^(\d+)\. (.*)$/);
    if (numberedMatch) {
      this.elements.editor.setRangeText(
        numberedMatch[2],
        lineStart,
        actualLineEnd,
        'end'
      );
    } else {
      let number = 1;

      const beforeText = value.substring(0, lineStart);
      const previousLines = beforeText.split('\n');

      for (let i = previousLines.length - 1; i >= 0; i--) {
        const match = previousLines[i].match(/^(\d+)\. /);
        if (match) {
          number = parseInt(match[1]) + 1;
          break;
        }
        if (previousLines[i].trim() === '') continue;
        break;
      }

      const newLine = `${number}. ${currentLine}`;
      this.elements.editor.setRangeText(
        newLine,
        lineStart,
        actualLineEnd,
        'end'
      );
    }

    this.elements.editor.focus();
    this.updatePreview();
  }

  private insertLink(): void {
    const selectedText = this.getSelectedText();
    const linkText = selectedText || 'link text';
    const url = 'https://example.com';

    this.insertAtCursor(`[${linkText}](${url})`);
  }

  private insertImage(): void {
    const selectedText = this.getSelectedText();
    const altText = selectedText || 'image description';
    const url = 'https://example.com/image.jpg';

    this.insertAtCursor(`![${altText}](${url})`);
  }

  private insertCodeBlock(): void {
    const selectedText = this.getSelectedText();
    const code = selectedText || 'your code here';

    this.insertAtCursor(`\n\`\`\`javascript\n${code}\n\`\`\`\n`);
  }

  private insertTable(): void {
    const table = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;
    this.insertAtCursor(table);
  }

  private insertAtCursor(text: string): void {
    const start = this.elements.editor.selectionStart;
    const end = this.elements.editor.selectionEnd;

    this.elements.editor.setRangeText(text, start, end, 'end');
    this.elements.editor.focus();
    this.updatePreview();
  }

  private getSelectedText(): string {
    const start = this.elements.editor.selectionStart;
    const end = this.elements.editor.selectionEnd;
    return this.elements.editor.value.substring(start, end);
  }

  private switchTab(tab: string): void {
    this.elements.tabs.forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');

    this.state.activeTab = tab as any;

    this.elements.editorPane.classList.add('hidden');
    this.elements.previewPane.classList.add('hidden');
    this.elements.htmlPane.classList.add('hidden');
    this.elements.editorPane.classList.remove('full-width');
    this.elements.previewPane.classList.remove('full-width');
    this.elements.htmlPane.classList.remove('full-width');

    switch (tab) {
      case 'edit':
        this.elements.editorPane.classList.remove('hidden');
        this.elements.editorPane.classList.add('full-width');
        break;
      case 'preview':
        this.elements.previewPane.classList.remove('hidden');
        this.elements.previewPane.classList.add('full-width');
        break;
      case 'html':
        this.elements.htmlPane.classList.remove('hidden');
        this.elements.htmlPane.classList.add('full-width');
        break;
      case 'split':
        this.elements.editorPane.classList.remove('hidden');
        this.elements.previewPane.classList.remove('hidden');
        break;
    }
  }

  private parseMarkdown(text: string): string {
    let html = text;

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    html = html.replace(/^---$/gim, '<hr>');

    html = this.parseMarkdownTables(html);

    html = this.parseMarkdownLists(html);

    html = html
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (paragraph && !this.isHtmlBlock(paragraph)) {
          return `<p>${paragraph}</p>`;
        }
        return paragraph;
      })
      .join('\n\n');

    return html;
  }

  private parseMarkdownTables(html: string): string {
    const lines = html.split('\n');
    const result: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.includes('|') && !line.match(/^```|<pre>|<code>/)) {
        const tableLines: string[] = [];
        let j = i;

        while (j < lines.length && lines[j].includes('|')) {
          tableLines.push(lines[j]);
          j++;
        }

        if (tableLines.length >= 2) {
          const headerSeparator = tableLines[1];
          if (headerSeparator.includes('-') && headerSeparator.includes('|')) {
            result.push(this.convertToTable(tableLines));
            i = j;
            continue;
          }
        }
      }

      result.push(line);
      i++;
    }

    return result.join('\n');
  }

  private convertToTable(tableLines: string[]): string {
    let tableHtml = '<table>';

    if (tableLines.length > 0) {
      const headerCells = tableLines[0]
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim());

      tableHtml += '<thead><tr>';
      headerCells.forEach(cell => {
        tableHtml += `<th>${cell}</th>`;
      });
      tableHtml += '</tr></thead>';
    }

    if (tableLines.length > 2) {
      tableHtml += '<tbody>';
      for (let i = 2; i < tableLines.length; i++) {
        const cells = tableLines[i]
          .split('|')
          .slice(1, -1)
          .map(cell => cell.trim());

        tableHtml += '<tr>';
        cells.forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody>';
    }

    tableHtml += '</table>';
    return tableHtml;
  }

  private parseMarkdownLists(html: string): string {
    const lines = html.split('\n');
    const result: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const numberedMatch = line.match(/^\d+\. (.*)$/);
      const bulletMatch = line.match(/^- (.*)$/);

      if (numberedMatch || bulletMatch) {
        const listLines: string[] = [];
        const isOrdered = !!numberedMatch;
        let j = i;

        while (j < lines.length) {
          const currentLine = lines[j];
          const isNumberedItem = currentLine.match(/^\d+\. /);
          const isBulletItem = currentLine.match(/^- /);
          const isIndentedItem = currentLine.match(/^  - /);
          const isEmpty = currentLine.trim() === '';

          if (
            (isOrdered && isNumberedItem) ||
            (!isOrdered && isBulletItem) ||
            isIndentedItem ||
            isEmpty
          ) {
            listLines.push(currentLine);
            j++;
          } else {
            break;
          }
        }

        result.push(this.convertToList(listLines, isOrdered));
        i = j;
      } else {
        result.push(line);
        i++;
      }
    }

    return result.join('\n');
  }

  private convertToList(listLines: string[], isOrdered: boolean): string {
    const tag = isOrdered ? 'ol' : 'ul';
    let listHtml = `<${tag}>`;

    listLines.forEach(line => {
      const numberedMatch = line.match(/^\d+\. (.*)$/);
      const bulletMatch = line.match(/^- (.*)$/);
      const indentedMatch = line.match(/^  - (.*)$/);

      if (numberedMatch) {
        listHtml += `<li>${numberedMatch[1]}</li>`;
      } else if (bulletMatch) {
        listHtml += `<li>${bulletMatch[1]}</li>`;
      } else if (indentedMatch) {
        listHtml += `<li style="margin-left: 1rem;">${indentedMatch[1]}</li>`;
      }
    });

    listHtml += `</${tag}>`;
    return listHtml;
  }

  private isHtmlBlock(text: string): boolean {
    return (
      text.startsWith('<') &&
      (text.includes('<h1>') ||
        text.includes('<h2>') ||
        text.includes('<h3>') ||
        text.includes('<pre>') ||
        text.includes('<table>') ||
        text.includes('<ul>') ||
        text.includes('<ol>') ||
        text.includes('<blockquote>') ||
        text.includes('<hr>'))
    );
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private updatePreview(): void {
    const html = this.parseMarkdown(this.elements.editor.value);
    this.elements.preview.innerHTML = html;

    this.elements.htmlOutput.textContent = this.formatHtml(html);
  }

  private formatHtml(html: string): string {
    let formatted = html;

    formatted = formatted.replace(/></g, '>\n<');

    let lines = formatted.split('\n');
    let indentLevel = 0;
    let formattedLines: string[] = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      formattedLines.push('  '.repeat(indentLevel) + line);

      if (
        line.startsWith('<') &&
        !line.startsWith('</') &&
        !line.endsWith('/>') &&
        !this.isSelfClosingTag(line)
      ) {
        indentLevel++;
      }
    });

    return formattedLines.join('\n');
  }

  private isSelfClosingTag(line: string): boolean {
    const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
    return selfClosingTags.some(tag => line.includes(`<${tag}`));
  }

  private async copyHtmlToClipboard(): Promise<void> {
    const htmlCode = this.elements.htmlOutput.textContent;

    try {
      await navigator.clipboard.writeText(htmlCode || '');
      const btn = this.elements.copyHtmlBtn;
      const originalText = btn.textContent;

      btn.textContent = 'Copied!';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  }

  private exportFile(): void {
    const content = this.elements.editor.value;
    const filename = this.elements.fileName.value || 'document.md';

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private importFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.elements.editor.value = e.target?.result as string;
        this.elements.fileName.value = file.name;
        this.updatePreview();
      };
      reader.readAsText(file);
    }
  }
}
