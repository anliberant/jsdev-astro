export class SimpleMDXController {
  private editor: HTMLTextAreaElement | null = null;
  private preview: HTMLElement | null = null;
  private htmlOutput: HTMLElement | null = null;

  constructor() {
    // Check if required elements exist
    const requiredElements = ['editor', 'preview', 'htmlOutput'];
    const elementsExist = requiredElements.every(id => document.getElementById(id));

    if (!elementsExist) {
      console.log('SimpleMDXController: Required elements not found, skipping initialization');
      return;
    }

    this.initializeElements();
    this.bindEvents();
    this.updatePreview();
  }

  private initializeElements(): void {
    this.editor = document.getElementById('editor') as HTMLTextAreaElement;
    this.preview = document.getElementById('preview') as HTMLElement;
    this.htmlOutput = document.getElementById('htmlOutput') as HTMLElement;
  }

  private bindEvents(): void {
    if (this.editor) {
      this.editor.addEventListener('input', () => this.updatePreview());
    }

    // Copy HTML button
    const copyBtn = document.getElementById('copyHtmlBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyHTML());
    }
  }

  private updatePreview(): void {
    if (!this.editor || !this.preview || !this.htmlOutput) return;

    const markdown = this.editor.value;
    const html = this.convertMarkdownToHtml(markdown);

    // Update preview
    this.preview.innerHTML = html;

    // Update HTML output
    this.htmlOutput.textContent = html;
  }

  private convertMarkdownToHtml(markdown: string): string {
    let html = markdown;

    // Basic markdown conversion
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)\n```/gim, '<pre><code>$2</code></pre>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr>');

    // Lists
    html = html.replace(/^- (.*)$/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');

    // Line breaks to paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/gim, '$1');

    return html;
  }

  private async copyHTML(): Promise<void> {
    if (!this.htmlOutput) return;

    try {
      const text = this.htmlOutput.textContent || '';
      await navigator.clipboard.writeText(text);
      
      const btn = document.getElementById('copyHtmlBtn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy HTML:', error);
    }
  }
}