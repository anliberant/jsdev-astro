export const SAMPLE_HTML = {
  jsx: `<div className="container">
  <header className="header">
    <h1>Welcome to React</h1>
    <nav>
      <ul className="nav-list">
        <li><a href="#home" className="nav-link">Home</a></li>
        <li><a href="#about" className="nav-link">About</a></li>
        <li><a href="#contact" className="nav-link">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main className="main-content">
    <section className="hero" style="background-color: #f0f0f0; padding: 20px;">
      <h2>Hero Section</h2>
      <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <button type="submit" className="btn btn-primary" disabled>Click Me</button>
      <input type="text" placeholder="Enter your name" maxLength="50" />
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

  astro: `<div class="container">
  <header class="header">
    <h1>Welcome to Astro</h1>
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
      <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <button type="submit" class="btn btn-primary">Click Me</button>
    </section>
  </main>
</div>`,

  markdown: `<div class="content">
  <h1>Sample HTML Document</h1>
  <p>This is a <strong>sample paragraph</strong> with <em>various HTML tags</em>.</p>
  <h2>Features</h2>
  <ul>
    <li>Lists</li>
    <li>Tables</li>
    <li>Code blocks</li>
  </ul>
  <blockquote>
    This is an important quote that contains valuable information.
  </blockquote>
  <pre><code>function hello() {
    console.log("Hello World!");
  }</code></pre>
</div>`,

  encoder: `<div class="example">
  <h1>HTML Encoder &amp; Decoder Example</h1>
  <p>Special characters: &lt; &gt; &amp; &quot; &#39;</p>
  <p>Symbols: &copy; &reg; &trade; &euro;</p>
  <p>Accented: &agrave; &eacute; &iacute; &oacute; &uacute;</p>
</div>`
};

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function getElementById<T extends HTMLElement>(id: string): T | null {
  try {
    return document.getElementById(id) as T | null;
  } catch (error) {
    console.error(`Error getting element with id "${id}":`, error);
    return null;
  }
}

export function getInputValue(id: string): string {
  const element = getElementById<HTMLInputElement | HTMLTextAreaElement>(id);
  return element?.value || '';
}

export function setTextContent(id: string, content: string): void {
  const element = getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

export function temporaryButtonText(
  button: HTMLElement,
  tempText: string,
  originalText: string,
  duration: number = 2000
): void {
  const original = button.textContent || originalText;
  button.textContent = tempText;
  
  setTimeout(() => {
    button.textContent = original;
  }, duration);
}