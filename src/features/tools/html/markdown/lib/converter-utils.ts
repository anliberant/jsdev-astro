export function calculateStats(text: string): ConversionStats {
  const lines = text.split('\n').length;
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  return {
    lines,
    characters,
    words
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function sanitizeHtml(html: string): string {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

export function validateHtml(html: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return !doc.querySelector('parsererror');
  } catch (error) {
    return false;
  }
}

export function validateMarkdown(markdown: string): boolean {
  // Basic markdown validation
  if (!markdown.trim()) return false;
  
  // Check for balanced code blocks
  const codeBlockMatches = markdown.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    return false;
  }
  
  return true;
}

export function formatHtml(html: string): string {
  if (!html.trim()) return '';
  
  // Simple HTML formatting
  let formatted = html;
  
  // Add line breaks after closing tags
  formatted = formatted.replace(/></g, '>\n<');
  
  // Indent nested elements
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const formattedLines: string[] = [];
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Decrease indent for closing tags
    if (line.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    formattedLines.push('  '.repeat(indentLevel) + line);
    
    // Increase indent for opening tags (but not self-closing)
    if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !isSelfClosingTag(line)) {
      indentLevel++;
    }
  });
  
  return formattedLines.join('\n');
}

function isSelfClosingTag(line: string): boolean {
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
  return selfClosingTags.some(tag => line.includes(`<${tag}`));
}

export function getSampleMarkdown(): string {
  return `# Sample Markdown Document

This is a **sample** *markdown* document that demonstrates various markdown features.

## Features Included

### Text Formatting
- **Bold text** using double asterisks
- *Italic text* using single asterisks
- \`Inline code\` using backticks
- ~~Strikethrough text~~ using tildes

### Lists
1. Numbered list item one
2. Numbered list item two
3. Numbered list item three

- Bullet point one
- Bullet point two
- Bullet point three

### Links and Images
[Visit Example.com](https://example.com)
![Sample Image](https://via.placeholder.com/300x200)

### Code Blocks
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

### Blockquotes
> This is a blockquote that contains important information.
> It can span multiple lines and provides emphasis.

### Tables
| Feature | Status | Priority |
|---------|--------|----------|
| Headers | ✅ Complete | High |
| Lists | ✅ Complete | High |
| Tables | ✅ Complete | Medium |
| Images | ✅ Complete | Low |

### Horizontal Rule
---

That covers the basic markdown features supported by this converter!`;
}

export function getSampleHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>Sample HTML Document</h1>
            <nav>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#examples">Examples</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </header>

        <main>
            <section id="features">
                <h2>HTML Features</h2>
                <p>This document demonstrates various <strong>HTML elements</strong> that can be converted to <em>Markdown</em>.</p>
                
                <h3>Text Formatting</h3>
                <ul>
                    <li><strong>Bold text</strong> using strong tags</li>
                    <li><em>Italic text</em> using emphasis tags</li>
                    <li><code>Inline code</code> using code tags</li>
                </ul>

                <h3>Code Example</h3>
                <pre><code>function example() {
    return "Hello, World!";
}

console.log(example());</code></pre>

                <blockquote>
                    <p>This is an important quote that provides valuable context and information to the reader.</p>
                </blockquote>

                <h3>Data Table</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>HTML Tag</th>
                            <th>Markdown Equivalent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Headers</td>
                            <td>&lt;h1&gt; to &lt;h6&gt;</td>
                            <td># to ######</td>
                        </tr>
                        <tr>
                            <td>Bold</td>
                            <td>&lt;strong&gt;</td>
                            <td>**text**</td>
                        </tr>
                        <tr>
                            <td>Italic</td>
                            <td>&lt;em&gt;</td>
                            <td>*text*</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section id="examples">
                <h2>Links and Images</h2>
                <p>Visit our <a href="https://example.com">homepage</a> for more information.</p>
                <img src="https://via.placeholder.com/400x200" alt="Sample placeholder image" />
            </section>
        </main>

        <footer>
            <hr>
            <p>&copy; 2025 Sample Document. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;