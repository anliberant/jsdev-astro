import { allTools } from '@/app/config/tools';

interface ToolController {
  controller: () => Promise<any>;
  requiredElements: string[];
}

class SimpleToolRouter {
  private static instance: SimpleToolRouter;
  private controllers: Map<string, ToolController> = new Map();

  static getInstance(): SimpleToolRouter {
    if (!SimpleToolRouter.instance) {
      SimpleToolRouter.instance = new SimpleToolRouter();
    }
    return SimpleToolRouter.instance;
  }

  constructor() {
    this.setupControllers();
  }

  private setupControllers(): void {
    // Map tool hrefs to their controllers
    this.controllers.set('/tools/html-to-jsx/', {
      controller: () => import('@/features/tools/html/jsx/lib/converter-controller')
        .then(m => new m.HtmlToJsxConverterController()),
      requiredElements: ['htmlInput', 'jsxOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/html-to-pug/', {
      controller: () => import('@/features/tools/html/pug/lib/converter-controller')
        .then(m => new m.HtmlToPugConverterController()),
      requiredElements: ['htmlInput', 'pugOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/html-to-astro/', {
      controller: () => import('@/features/tools/html/astro/lib/converter-controller')
        .then(m => new m.HtmlToAstroController()),
      requiredElements: ['htmlInput', 'astroOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/html-markdown/', {
      controller: () => import('@/features/tools/html/markdown/lib/converter-controller')
        .then(m => new m.HtmlMarkdownController()),
      requiredElements: ['htmlInput', 'markdownOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/html-encoder-decoder/', {
      controller: () => import('@/features/tools/html/encoder/lib/encoder-controller')
        .then(m => new m.HtmlEncoderDecoderController()),
      requiredElements: ['htmlInput', 'htmlOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/html-tag-remover/', {
      controller: () => import('@/features/tools/html/tag-remover/lib/tag-remover-controller')
        .then(m => new m.HtmlTagRemoverController()),
      requiredElements: ['htmlInput', 'htmlOutput', 'convertBtn', 'clearBtn', 'copyBtn']
    });

    this.controllers.set('/tools/box-shadow-generator/', {
      controller: () => import('@/features/tools/css/box-shadow/lib/box-shadow-controller')
        .then(m => new m.BoxShadowController()),
      requiredElements: ['shadowPreview', 'cssOutput']
    });

    this.controllers.set('/tools/neobrutalism-button/', {
      controller: () => import('@/features/tools/css/neobrutalism/lib/neobrutalism-controller')
        .then(m => new m.NeobrutalismController()),
      requiredElements: ['buttonPreview', 'cssOutput']
    });

    this.controllers.set('/tools/html-table-generator/', {
      controller: () => import('@/features/tools/html/table/lib/table-generator-controller')
        .then(m => new m.HtmlTableGeneratorController()),
      requiredElements: ['tablePreview', 'htmlOutput']
    });

    this.controllers.set('/tools/html-iframe-generator/', {
      controller: () => import('@/features/tools/html/iframe/lib/iframe-generator-controller')
        .then(m => new m.HtmlIframeGeneratorController()),
      requiredElements: ['iframePreview', 'htmlOutput']
    });

    this.controllers.set('/tools/html-boilerplate/', {
      controller: () => import('@/features/tools/html/boilerplate/lib/boilerplate-controller')
        .then(m => new m.HtmlBoilerplateController()),
      requiredElements: ['htmlOutput']
    });

    this.controllers.set('/tools/mdx-editor/', {
      controller: () => import('@/features/tools/text/mdx/lib/mdx-editor-controller')
        .then(m => new m.MdxEditorController()),
      requiredElements: ['mdxInput', 'htmlOutput']
    });
  }

  async initializeCurrentTool(): Promise<void> {
    const currentPath = window.location.pathname;
    
    // Check if current path matches any tool
    const toolController = this.controllers.get(currentPath);
    if (!toolController) {
      console.log(`No tool found for path: ${currentPath}`);
      return;
    }

    // Check if all required elements exist
    const missingElements = toolController.requiredElements.filter(id => 
      !document.getElementById(id)
    );

    if (missingElements.length > 0) {
      console.log(`Missing elements for ${currentPath}: ${missingElements.join(', ')}`);
      return;
    }

    try {
      console.log(`🚀 Initializing tool: ${currentPath}`);
      await toolController.controller();
      console.log(`✅ Tool initialized: ${currentPath}`);
    } catch (error) {
      console.error(`❌ Failed to initialize tool ${currentPath}:`, error);
    }
  }

  isToolPage(): boolean {
    const currentPath = window.location.pathname;
    return this.controllers.has(currentPath);
  }

  getCurrentToolPath(): string | null {
    const currentPath = window.location.pathname;
    return this.controllers.has(currentPath) ? currentPath : null;
  }
}

// Auto-initialize when script loads
function initializeTools(): void {
  const router = SimpleToolRouter.getInstance();
  
  const attemptInit = () => {
    if (router.isToolPage()) {
      router.initializeCurrentTool();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInit);
  } else {
    setTimeout(attemptInit, 100);
  }
}

// Only run in browser
if (typeof window !== 'undefined') {
  initializeTools();
}

export { SimpleToolRouter };