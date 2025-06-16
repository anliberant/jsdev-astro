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
  return `<div class="container">
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
</div>`;
}

export function temporaryButtonText(
  button: HTMLElement,
  tempText: string,
  originalText: string,
  duration = 2000
): void {
  button.innerHTML = tempText;
  setTimeout(() => {
    button.innerHTML = originalText;
  }, duration);
}
