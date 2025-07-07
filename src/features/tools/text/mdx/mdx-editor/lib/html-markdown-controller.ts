import { BaseConverterController } from '@/shared/lib/base-converter-controller';

type Elements = {
  editor: HTMLTextAreaElement;
  preview: HTMLElement;
  htmlOutput: HTMLElement;
  convertBtn: HTMLButtonElement;
  clearBtn: HTMLButtonElement;
  copyHtmlBtn: HTMLButtonElement;
  importInput: HTMLInputElement;
  exportBtn: HTMLButtonElement;
  stats: HTMLElement;
  tabs: NodeListOf<HTMLButtonElement>;
  panes: NodeListOf<HTMLElement>;
};

export class HtmlMarkdownController extends BaseConverterController<Elements> {
  protected initializeElements(): Elements {
    return {
      editor: this.safeGetElement<HTMLTextAreaElement>('editor')!,
      preview: this.safeGetElement<HTMLElement>('preview')!,
      htmlOutput: this.safeGetElement<HTMLElement>('htmlOutput')!,
      convertBtn: this.safeGetElement<HTMLButtonElement>('convertBtn')!,
      clearBtn: this.safeGetElement<HTMLButtonElement>('clearBtn')!,
      copyHtmlBtn: this.safeGetElement<HTMLButtonElement>('copyHtmlBtn')!,
      importInput: this.safeGetElement<HTMLInputElement>('fileImport')!,
      exportBtn: this.safeGetElement<HTMLButtonElement>('exportBtn')!,
      stats: this.safeGetElement<HTMLElement>('inputStats')!,
      tabs: document.querySelectorAll<HTMLButtonElement>('.tab-button'),
      panes: document.querySelectorAll<HTMLElement>('.editor-pane, .preview-pane, .html-pane'),
    };
  }

  protected bindEvents(): void {
    const update = () => {
      const html = this.markdownToHtml(this.elements.editor.value);
      this.updatePreviewPane(html);
    };

    this.safeAddEventListener(this.elements.editor, 'input', update);
    this.safeAddEventListener(this.elements.copyHtmlBtn, 'click', () => this.copyHtml());
    this.safeAddEventListener(this.elements.clearBtn, 'click', () => this.clear());
    this.safeAddEventListener(this.elements.importInput, 'change', (e) => this.importFile(e));
    this.safeAddEventListener(this.elements.exportBtn, 'click', () => this.exportFile());

    this.elements.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.activateTab(tab.dataset.tab!));
    });

    const buttons = [
      ['boldBtn', '**', '**'],
      ['italicBtn', '*', '*'],
      ['codeBtn', '`', '`'],
      ['strikeBtn', '~~', '~~'],
      ['h1Btn', '# ', ''],
      ['h2Btn', '## ', ''],
      ['h3Btn', '### ', ''],
      ['listBtn', '- ', ''],
      ['orderedListBtn', '1. ', ''],
      ['checklistBtn', '- [ ] ', ''],
      ['quoteBtn', '> ', ''],
      ['linkBtn', '[Link Text](https://example.com)', ''],
      ['imageBtn', '![Alt Text](https://example.com/image.png)', ''],
      ['codeBlockBtn', '```\n', '\n```'],
      ['tableBtn', '| Header | Header |\n| ------ | ------ |\n| Cell  | Cell   |', ''],
      ['hrBtn', '\n---\n', ''],
    ];

    for (const [id, before, after] of buttons) {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.insertText(before, after));
      }
    }

    // Initial render
    update();
  }

  private activateTab(tab: string): void {
    this.elements.tabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const modeMap = {
      edit: ['editor-pane'],
      preview: ['preview-pane'],
      html: ['html-pane'],
      split: ['editor-pane', 'preview-pane'],
    };

    const active = modeMap[tab] || [];

    this.elements.panes.forEach((pane) => {
      pane.classList.toggle('hidden', !active.some((cls) => pane.classList.contains(cls)));
    });
  }

  private insertText(before: string, after = '') {
    const textarea = this.elements.editor;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    const newText = before + selectedText + after;
    textarea.setRangeText(newText, start, end, 'end');
    textarea.focus();
    const html = this.markdownToHtml(textarea.value);
    this.updatePreviewPane(html);
  }

  private copyHtml(): void {
    const html = this.elements.htmlOutput.innerText;
    navigator.clipboard.writeText(html).then(() => {
      this.showMessage('HTML copied to clipboard');
    });
  }

  private clear(): void {
    this.elements.editor.value = '';
    const html = this.markdownToHtml('');
    this.updatePreviewPane(html);
  }

  private importFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.elements.editor.value = reader.result as string;
      const html = this.markdownToHtml(this.elements.editor.value);
      this.updatePreviewPane(html);
    };
    reader.readAsText(file);
  }

  private exportFile(): void {
    const blob = new Blob([this.elements.editor.value], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.md';
    link.click();
  }

  protected updateStats(): void {
    const text = this.elements.editor.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    this.elements.stats.innerText = `Words: ${words}, Characters: ${chars}`;
  }

  private sanitizeHtml(html: string): string {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  }

  private markdownToHtml(markdown: string): string {
    let html = markdown;
  
    // Headings
    html = html
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>');
  
    // Blockquote
    html = html.replace(/^> (.*)$/gm, '<blockquote class="mdx-blockquote">$1</blockquote>');
  
    // Inline styles
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
    // Horizontal rules
    html = html.replace(/^\s*---\s*$/gm, '<hr>');
  
    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="mdx-link external-link" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    // Universal list parser (both - and 1.)
html = html.replace(/((^(\s*)([-*]|\d+\.) .+\n?)+)/gm, (match) => {
  const lines = match.trim().split('\n');
  let result = '';
  let lastIndent = 0;
  const stack: { type: 'ul' | 'ol'; indent: number }[] = [];

  const getListType = (line: string) =>
    /^\s*\d+\./.test(line) ? 'ol' : 'ul';

  for (const line of lines) {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const type = getListType(line);
    const content = line.replace(/^(\s*)([-*]|\d+\.)\s+/, '').trim();

    while (stack.length && indent < stack[stack.length - 1].indent) {
      result += '</li></' + stack.pop()!.type + '>';
    }

    if (!stack.length || indent > stack[stack.length - 1].indent) {
      result += `<${type} class="mdx-list ${type === 'ul' ? 'unordered' : 'ordered'}"><li class="mdx-list-item">`;
      stack.push({ type, indent });
    } else if (indent === stack[stack.length - 1].indent) {
      result += '</li><li class="mdx-list-item">';
    }

    result += content;
    lastIndent = indent;
  }

  while (stack.length) {
    result += '</li></' + stack.pop()!.type + '>';
  }

  return result;
});

  
    // Tables
    html = html.replace(/\|(.+)\|\n\|([-:\s|]+)\|\n((\|.*\|\n?)*)/g, (_, header, divider, rows) => {
      const sanitize = (line: string) =>
        line
          .trim()
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0);
  
      const heads = sanitize(header).map(cell => `<th>${cell}</th>`).join('');
      const body = rows
        .trim()
        .split('\n')
        .map(row => {
          const cells = sanitize(row).map(cell => `<td>${cell}</td>`).join('');
          return `<tr>${cells}</tr>`;
        })
        .join('');
  
      return `<table><thead><tr>${heads}</tr></thead><tbody>${body}</tbody></table>`;
    });
  
    // Paragraphs
    const blockTags = ['<h1', '<h2', '<h3', '<blockquote', '<ul', '<ol', '<pre', '<table', '<hr'];
    const lines = html.split('\n');
    html = lines.map(line => {
      if (line.trim() === '') return '';
      if (blockTags.some(tag => line.trim().startsWith(tag))) return line;
      return `<p>${line}</p>`;
    }).join('\n');
  
    return this.sanitizeHtml(html);
  }
  
  

  private updatePreviewPane(html: string) {
    const preview = this.elements.preview;
    const htmlOutput = this.elements.htmlOutput;

    if (!html.trim()) {
      preview.innerHTML = '<p><em>No content</em></p>';
      htmlOutput.textContent = '';
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('blockquote').forEach((bq) => {
      bq.classList.add('mdx-blockquote');
    });

    preview.innerHTML = doc.body.innerHTML;
    htmlOutput.textContent = html;
  }

  protected getSampleInput(): string {
    return this.elements.editor.value;
  }
}
