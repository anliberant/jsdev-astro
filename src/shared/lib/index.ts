export const SAMPLE_HTML = {
  encoder: `<div class="container">
  <h1>Welcome to the Encoder</h1>
  <p>This &amp; that &lt; those &gt; these</p>
  <ul>
    <li>Encode &amp; Decode</li>
    <li>Special characters: &quot; &apos;</li>
  </ul>
</div>`,

  markdown: `# Welcome to Markdown

This is a **bold** paragraph with _italic text_.

- Item 1
- Item 2
- [Visit jsdev.space](https://jsdev.space)
`,

  pug: `div.container
  h1 Welcome to Pug
  p This is a sample paragraph
  ul
    li First item
    li Second item
    li Third item`,

  jsx: `<div className="container">
  <h1>Hello from JSX</h1>
  <p>This is a paragraph inside a React JSX element.</p>
  <ul>
    <li>JSX supports arrays</li>
    <li>And expressions: {2 + 2}</li>
  </ul>
</div>`
};