import type { ConversionStats } from '../types/converter';

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
    // removed log: console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function getSampleHtml(): string {
  return `<div className="container">
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
</div>`;
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
