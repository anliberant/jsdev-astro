interface ToolConfig {
  name: string;
  urlPattern: string;
  requiredElements: string[];
  controller: () => Promise<any>;
  priority?: number;
}

class GlobalToolsManager {
  private static instance: GlobalToolsManager;
  private registeredTools: Map<string, ToolConfig> = new Map();
  private activeTool: string | null = null;
  private initialized = false;

  static getInstance(): GlobalToolsManager {
    if (!GlobalToolsManager.instance) {
      GlobalToolsManager.instance = new GlobalToolsManager();
    }
    return GlobalToolsManager.instance;
  }

  constructor() {
    this.detectCurrentTool();
    this.setupErrorHandling();
  }

  private detectCurrentTool(): void {
    const path = window.location.pathname;
    
    const toolPatterns: Record<string, string> = {
      'html-markdown': '/tools/html-markdown/',
      'html-jsx': '/tools/html-to-jsx/',
      'html-pug': '/tools/html-to-pug/',
      'html-astro': '/tools/html-to-astro/',
      'html-encoder': '/tools/html-encoder-decoder/',
      'html-tag-remover': '/tools/html-tag-remover/',
      'box-shadow': '/tools/box-shadow-generator/',
      'neobrutalism': '/tools/neobrutalism-button/',
      'html-table': '/tools/html-table-generator/',
      'html-iframe': '/tools/html-iframe-generator/',
      'html-boilerplate': '/tools/html-boilerplate/',
      'mdx-editor': '/tools/mdx-editor/'
    };

    for (const [toolName, pattern] of Object.entries(toolPatterns)) {
      if (path.includes(pattern)) {
        this.activeTool = toolName;
        console.log(`🔧 Detected tool: ${toolName}`);
        break;
      }
    }

    if (!this.activeTool) {
      console.log('🏠 Not on a tool page');
    }
  }

  registerTool(config: ToolConfig): void {
    this.registeredTools.set(config.name, config);
    console.log(`📝 Registered tool: ${config.name}`);
  }

  async initializeCurrentTool(): Promise<void> {
    if (this.initialized || !this.activeTool) {
      return;
    }

    const toolConfig = this.registeredTools.get(this.activeTool);
    if (!toolConfig) {
      console.log(`Tool config not found for: ${this.activeTool}`);
      return;
    }

    const missingElements = toolConfig.requiredElements.filter(id => {
      try {
        return !document.getElementById(id);
      } catch {
        return true;
      }
    });

    if (missingElements.length > 0) {
      console.log(`Tool ${this.activeTool}: Missing elements [${missingElements.join(', ')}]`);
      return;
    }

    try {
      console.log(`🚀 Initializing tool: ${this.activeTool}`);
      await toolConfig.controller();
      this.initialized = true;
      console.log(`✅ Tool ${this.activeTool} initialized successfully`);
    } catch (error) {
      console.error(`❌ Tool ${this.activeTool} initialization failed:`, error);
    }
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      if (event.filename && event.filename.includes('converter') ||
          event.message.includes('Cannot set properties of null') ||
          event.message.includes('Cannot read properties of null')) {
        
        console.warn(`🛡️ Tool error prevented:`, {
          message: event.message,
          filename: event.filename,
          tool: this.activeTool
        });
        
        event.preventDefault();
        return false;
      }
    });
  }

  isCurrentTool(toolName: string): boolean {
    return this.activeTool === toolName;
  }

  getCurrentTool(): string | null {
    return this.activeTool;
  }

  reset(): void {
    this.initialized = false;
    this.activeTool = null;
  }
}

if (typeof window !== 'undefined') {
  const manager = GlobalToolsManager.getInstance();
  
  const toolConfigs: ToolConfig[] = [
    {
      name: 'html-markdown',
      urlPattern: '/tools/html-markdown',
      requiredElements: ['htmlInput', 'markdownOutput', 'convertBtn', 'clearBtn', 'copyBtn'],
      controller: () => import('@/features/tools/html/markdown/lib/converter-controller')
        .then(({ HtmlMarkdownController }) => new HtmlMarkdownController())
    },
    {
      name: 'html-jsx',
      urlPattern: '/tools/html-to-jsx',
      requiredElements: ['htmlInput', 'jsxOutput', 'convertBtn', 'clearBtn', 'copyBtn'],
      controller: () => import('@/features/tools/html/jsx/lib/converter-controller')
        .then(({ HtmlToJsxConverterController }) => new HtmlToJsxConverterController())
    },
    {
      name: 'html-pug',
      urlPattern: '/tools/html-to-pug',
      requiredElements: ['htmlInput', 'pugOutput', 'convertBtn', 'clearBtn', 'copyBtn'],
      controller: () => import('@/features/tools/html/pug/lib/converter-controller')
        .then(({ HtmlToPugConverterController }) => new HtmlToPugConverterController())
    },
    {
      name: 'html-astro',
      urlPattern: '/tools/html-to-astro',
      requiredElements: ['htmlInput', 'astroOutput', 'convertBtn', 'clearBtn', 'copyBtn'],
      controller: () => import('@/features/tools/html/astro/lib/converter-controller')
        .then(({ HtmlToAstroController }) => new HtmlToAstroController())
    },
    {
      name: 'html-encoder',
      urlPattern: '/tools/html-encoder-decoder',
      requiredElements: ['htmlInput', 'htmlOutput', 'convertBtn', 'clearBtn', 'copyBtn'],
      controller: () => import('@/features/tools/html/encoder/lib/encoder-controller')
        .then(({ HtmlEncoderDecoderController }) => new HtmlEncoderDecoderController())
    }
  ];

  toolConfigs.forEach(config => manager.registerTool(config));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => manager.initializeCurrentTool(), 100);
    });
  } else {
    setTimeout(() => manager.initializeCurrentTool(), 100);
  }

  (window as any).toolsManager = manager;
}

export { GlobalToolsManager };