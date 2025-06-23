export class ToolRouteDetector {
  private static readonly TOOL_ROUTES: Record<string, {
    pattern: string;
    controller: string;
    className: string;
    requiredElements: string[];
    preload?: boolean;
  }> = {
    'html-markdown': {
      pattern: '/tools/html-markdown',
      controller: '@/features/tools/html/markdown/lib/converter-controller',
      className: 'HtmlMarkdownController',
      requiredElements: ['htmlInput', 'markdownOutput'],
      preload: true
    },
    'html-jsx': {
      pattern: '/tools/html-to-jsx',
      controller: '@/features/tools/html/jsx/lib/converter-controller',
      className: 'HtmlToJsxConverterController',
      requiredElements: ['htmlInput', 'jsxOutput']
    },
    'html-pug': {
      pattern: '/tools/html-to-pug',
      controller: '@/features/tools/html/pug/lib/converter-controller',
      className: 'HtmlToPugConverterController',
      requiredElements: ['htmlInput', 'pugOutput']
    },
    'html-astro': {
      pattern: '/tools/html-to-astro',
      controller: '@/features/tools/html/astro/lib/converter-controller',
      className: 'HtmlToAstroController',
      requiredElements: ['htmlInput', 'astroOutput']
    },
    'html-encoder': {
      pattern: '/tools/html-encoder-decoder',
      controller: '@/features/tools/html/encoder/lib/encoder-controller',
      className: 'HtmlEncoderDecoderController',
      requiredElements: ['htmlInput', 'htmlOutput']
    },
    'html-tag-remover': {
      pattern: '/tools/html-tag-remover',
      controller: '@/features/tools/html/tag-remover/lib/tag-remover-controller',
      className: 'HtmlTagRemoverController',
      requiredElements: ['htmlInput', 'textOutput']
    },
    'box-shadow': {
      pattern: '/tools/box-shadow-generator',
      controller: '@/features/tools/css/box-shadow/lib/box-shadow-controller',
      className: 'BoxShadowGeneratorController',
      requiredElements: ['preview', 'cssOutput']
    },
    'neobrutalism': {
      pattern: '/tools/neobrutalism-button',
      controller: '@/features/tools/css/neobrutalism/lib/neobrutalism-controller',
      className: 'NeobrutalismGeneratorController',
      requiredElements: ['preview', 'cssOutput']
    }
  };

  static detectCurrentTool(): { name: string; config: any } | null {
    const currentPath = window.location.pathname;
    
    for (const [toolName, config] of Object.entries(this.TOOL_ROUTES)) {
      if (currentPath.includes(config.pattern)) {
        return { name: toolName, config };
      }
    }
    
    return null;
  }

  static async initializeCurrentTool(): Promise<void> {
    const detected = this.detectCurrentTool();
    
    if (!detected) {
      console.log('🏠 Not on a tool page');
      return;
    }

    const { name, config } = detected;
    console.log(`🔧 Detected tool: ${name}`);

    const missingElements = config.requiredElements.filter((id: string) => {
      try {
        return !document.getElementById(id);
      } catch {
        return true;
      }
    });

    if (missingElements.length > 0) {
      console.log(`Tool ${name}: Missing elements [${missingElements.join(', ')}], skipping`);
      return;
    }

    try {
      await LazyToolLoader.loadTool(name, config.controller, config.className);
    } catch (error) {
      console.error(`Failed to initialize tool ${name}:`, error);
    }
  }

  static preloadRelatedTools(): void {
    const detected = this.detectCurrentTool();
    if (!detected) return;

    const relatedTools = this.getRelatedTools(detected.name);
    
    relatedTools.forEach(toolName => {
      const config = this.TOOL_ROUTES[toolName];
      if (config && config.preload) {
        LazyToolLoader.preloadTool(toolName, config.controller);
      }
    });
  }

  private static getRelatedTools(currentTool: string): string[] {
    const toolGroups: Record<string, string[]> = {
      'html-converters': ['html-jsx', 'html-pug', 'html-astro', 'html-markdown'],
      'html-utilities': ['html-encoder', 'html-tag-remover'],
      'css-tools': ['box-shadow', 'neobrutalism']
    };

    for (const [groupName, tools] of Object.entries(toolGroups)) {
      if (tools.includes(currentTool)) {
        return tools.filter(tool => tool !== currentTool);
      }
    }

    return [];
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        ToolRouteDetector.initializeCurrentTool();
        setTimeout(() => ToolRouteDetector.preloadRelatedTools(), 2000);
      }, 100);
    });
  } else {
    setTimeout(() => {
      ToolRouteDetector.initializeCurrentTool();
      setTimeout(() => ToolRouteDetector.preloadRelatedTools(), 2000);
    }, 100);
  }

  window.addEventListener('error', (event) => {
    if (event.message.includes('Cannot set properties of null') ||
        event.message.includes('Cannot read properties of null') ||
        (event.filename && event.filename.includes('converter'))) {
      
      console.warn('🛡️ Tool error intercepted:', event.message);
      event.preventDefault();
      return false;
    }
  });

  (window as any).toolLoader = LazyToolLoader;
  (window as any).toolDetector = ToolRouteDetector;
}