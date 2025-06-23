export class ToolRouter {
  private static instance: ToolRouter;
  private currentTool: string | null = null;
  
  static getInstance(): ToolRouter {
    if (!ToolRouter.instance) {
      ToolRouter.instance = new ToolRouter();
    }
    return ToolRouter.instance;
  }

  constructor() {
    this.currentTool = this.detectCurrentTool();
  }

  private detectCurrentTool(): string | null {
    const path = window.location.pathname;
    
    // Мапа путей к тулзам
    const toolMap: Record<string, string> = {
      '/tools/html-markdown': 'html-markdown',
      '/tools/html-to-jsx': 'html-jsx',
      '/tools/html-to-pug': 'html-pug',
      '/tools/html-to-astro': 'html-astro',
      '/tools/html-encoder-decoder': 'html-encoder',
      '/tools/html-tag-remover': 'html-tag-remover',
      '/tools/box-shadow-generator': 'box-shadow',
      '/tools/neobrutalism-button': 'neobrutalism',
      '/tools/html-table-generator': 'html-table',
      '/tools/html-iframe-generator': 'html-iframe',
      '/tools/html-boilerplate': 'html-boilerplate',
      '/tools/mdx-editor': 'mdx-editor'
    };

    return toolMap[path] || null;
  }

  isCurrentTool(toolName: string): boolean {
    return this.currentTool === toolName;
  }

  getCurrentTool(): string | null {
    return this.currentTool;
  }
}