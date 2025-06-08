# HTML ⇄ Markdown Converter

A bidirectional converter tool that transforms HTML to Markdown and vice versa, following the FSD (Feature-Sliced Design) architecture.

## Features

- **Bidirectional Conversion**: Switch between HTML→Markdown and Markdown→HTML modes
- **Table Support**: Convert HTML tables to Markdown tables and back
- **Formatting Options**:
  - Preserve HTML tags in Markdown output
  - Preserve whitespace
  - Convert tables (can be disabled)
- **Live Statistics**: Shows lines, characters, and conversion stats
- **Sample Content**: Built-in samples for testing
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

```
src/features/tools/html/markdown/
├── lib/
│   ├── html-to-markdown-converter.ts    # HTML→MD conversion logic
│   ├── markdown-to-html-converter.ts    # MD→HTML conversion logic
│   ├── converter-controller.ts          # Main controller
│   └── converter-utils.ts               # Utility functions
├── types/
│   └── converter.ts                     # TypeScript interfaces
├── html-markdown-converter.astro        # Main component
└── README.md                           # Documentation
```

## Usage

### HTML to Markdown

Converts HTML elements to their Markdown equivalents:

- Headers (`<h1>` → `# Header`)
- Text formatting (`<strong>` → `**bold**`, `<em>` → `*italic*`)
- Links (`<a href="url">text</a>` → `[text](url)`)
- Code blocks (`<pre><code>` → `code`)
- Tables (full table structure → Markdown table syntax)

### Markdown to HTML

Converts Markdown syntax to HTML:

- Headers (`# Header` → `<h1>Header</h1>`)
- Text formatting (`**bold**` → `<strong>bold</strong>`)
- Lists (both ordered and unordered)
- Code blocks with language detection
- Tables with proper thead/tbody structure

## Options

- **Preserve HTML Tags**: Keep unrecognized HTML tags in Markdown output
- **Preserve Whitespace**: Maintain original whitespace formatting
- **Convert Tables**: Enable/disable table conversion (useful for complex tables)

## Integration

The tool is integrated into the main tools page and follows the established patterns:

- Uses the base converter controller for common functionality
- Implements proper error handling and user feedback
- Responsive design matching other tools
- Proper TypeScript typing throughout

## Dependencies

- DOMParser (built-in): For HTML parsing
- BaseConverterController: Shared functionality with other converters
- Lucide icons: For UI elements
- Astro: Framework integration

The converter handles edge cases like malformed HTML, nested lists, complex tables, and preserves the semantic meaning during conversion while providing a clean, user-friendly interface.
