import type { BoilerplateConfig } from '@/shared/types';

export function generateHTMLBoilerplate(config: BoilerplateConfig): string {
  const { title, description, author } = config;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>`;

  if (description) {
    html += `\n    <meta name="description" content="${description}">`;
  }

  if (author) {
    html += `\n    <meta name="author" content="${author}">`;
  }

  html += `
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- CSS -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">`;

  if (description) {
    html += `\n    <meta property="og:description" content="${description}">`;
  }

  html += `
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">`;

  if (description) {
    html += `\n    <meta property="twitter:description" content="${description}">`;
  }

  html += `
</head>
<body>
    <header>
        <nav>
            <h1>${title}</h1>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>Welcome to ${title}</h2>`;

  if (description) {
    html += `\n            <p>${description}</p>`;
  }

  html += `
        </section>
        
        <section id="content">
            <h2>Main Content</h2>
            <p>Your content goes here...</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} ${title}.`;

  if (author) {
    html += ` Created by ${author}.`;
  }

  html += ` All rights reserved.</p>
    </footer>
    
    <!-- JavaScript -->
    <script src="script.js"></script>
</body>
</html>`;

  return html;
}
