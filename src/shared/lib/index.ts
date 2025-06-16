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

  // Исправленный и дополненный пример для markdown конвертера
  markdown: `<div class="content">
  <h1>Sample HTML Document</h1>
  <p>This is a <strong>sample paragraph</strong> with <em>various HTML tags</em>.</p>
  
  <h2>Features</h2>
  <ul>
    <li>Lists and nested items</li>
    <li>Tables and data</li>
    <li>Code blocks and snippets</li>
    <li>Links: <a href="https://example.com">Visit Example</a></li>
  </ul>
  
  <h3>Important Information</h3>
  <blockquote>
    This is an important quote that contains valuable information about the conversion process.
  </blockquote>
  
  <h4>Code Example</h4>
  <pre><code>function hello() {
    console.log("Hello World!");
    return "Welcome to HTML to Markdown conversion!";
}</code></pre>
  
  <p>You can also use <code>inline code</code> within paragraphs.</p>
  
  <hr>
  
  <p><strong>Note:</strong> This HTML will be converted to clean Markdown format.</p>
</div>`,

  encoder: `<div class="example">
  <h1>HTML Encoder &amp; Decoder Example</h1>
  <p>Special characters: &lt; &gt; &amp; &quot; &#39;</p>
  <p>Symbols: &copy; &reg; &trade; &euro;</p>
  <p>Accented: &agrave; &eacute; &iacute; &oacute; &uacute;</p>
</div>`
};