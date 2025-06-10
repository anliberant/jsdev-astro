import type { ConversionStats } from '@/shared/types';

export * from './classes';
export * from './format-url';
export * from './time';

export function calculateStats(text: string): ConversionStats {
  return {
    lines: text.split('\n').length,
    characters: text.length,
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

export function temporaryButtonText(
  button: HTMLElement,
  tempText: string,
  originalText: string,
  duration = 2000
): void {
  button.innerHTML = tempText;
  button.classList.add('copied');
  setTimeout(() => {
    button.innerHTML = originalText;
    button.classList.remove('copied');
  }, duration);
}

export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function getInputValue(id: string): string {
  const element = getElementById<HTMLInputElement>(id);
  return element?.value || '';
}

export function setTextContent(id: string, content: string): void {
  const element = getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

// Sample HTML for converters
export const SAMPLE_HTML = {
  jsx: `<div class="container">
  <header class="header">
    <h1>Welcome to React</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="#home" class="nav-link">Home</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <section style="background-color: #f0f0f0; padding: 20px;">
      <h2>Hero Section</h2>
      <p>This is a sample paragraph.</p>
      <button type="submit" class="btn" disabled>Click Me</button>
      <input type="text" placeholder="Enter text" maxLength="50" />
    </section>
  </main>
</div>`,

  pug: `<div class="container">
  <header id="main-header" class="header bg-primary">
    <h1>Welcome to Our Website</h1>
    <nav class="navigation">
      <ul class="nav-list">
        <li><a href="#home" class="nav-link active">Home</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <section class="hero">
      <h2>Hero Section</h2>
      <p>This is a sample paragraph.</p>
      <button type="submit" class="btn btn-primary" disabled>Click Me</button>
    </section>
  </main>
</div>`,

  astro: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <div class="container">
    <h1>Welcome to Astro</h1>
    <p>This is a sample HTML to convert to Astro component.</p>
  </div>
</body>
</html>`,

  markdown: `<div class="container">
  <header class="header">
    <h1>Welcome to Our Website</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="#home" class="nav-link">Home</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main class="main-content">
    <section class="hero">
      <h2>Hero Section</h2>
      <p>This is a <strong>sample</strong> paragraph with <em>emphasis</em>.</p>
      <blockquote>
        <p>This is an important quote that provides valuable information.</p>
      </blockquote>
      <pre><code>function example() {
  return "Hello World";
}</code></pre>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Conversion</td>
            <td>✅ Working</td>
          </tr>
          <tr>
            <td>Tables</td>
            <td>✅ Supported</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</div>`,
encoder: `<div class="example">
<h2>Special Characters & Symbols</h2>
<p>Copyright © 2024 - All rights reserved!</p>
<p>Price: $29.99 (was $39.99)</p>
<p>Math: 2 + 2 = 4, 5 > 3, 10 ≥ 5</p>
<p>Quotes: "Hello World" & 'Single quotes'</p>
<p>Symbols: ★ ♥ ♦ ♣ ♠ → ← ↑ ↓</p>
<p>Accents: café, naïve, résumé</p>
<script>
  console.log("This <script> tag will be encoded!");
</script>
</div>`,
};

export class ErrorHandler {
  static handle(error: unknown, context: string): string {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }
}

export function isValidHTML(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return !doc.querySelector('parsererror');
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/^\s+|\s+$/g, '');
}
