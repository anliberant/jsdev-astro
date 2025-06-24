import { BaseConverterController } from '@/shared/lib/base-converter-controller';

interface NeobrutalismElements {
  // Preview and outputs
  buttonPreview: HTMLElement | null;
  cssOutput: HTMLTextAreaElement | null;
  htmlOutput: HTMLTextAreaElement | null;
  copyBtn: HTMLButtonElement | null;
  copyHtmlBtn: HTMLButtonElement | null;
  
  // Text controls
  buttonText: HTMLInputElement | null;
  fontSize: HTMLInputElement | null;
  fontWeight: HTMLSelectElement | null;
  textTransform: HTMLSelectElement | null;
  letterSpacing: HTMLInputElement | null;
  
  // Color controls
  backgroundColor: HTMLInputElement | null;
  textColor: HTMLInputElement | null;
  borderColor: HTMLInputElement | null;
  shadowColor: HTMLInputElement | null;
  
  // Dimension controls
  paddingX: HTMLInputElement | null;
  paddingY: HTMLInputElement | null;
  borderWidth: HTMLInputElement | null;
  borderRadius: HTMLInputElement | null;
  shadowX: HTMLInputElement | null;
  shadowY: HTMLInputElement | null;
  
  // Animation controls
  hoverEffect: HTMLSelectElement | null;
  animationDuration: HTMLInputElement | null;
  
  // Tab controls
  previewTab: HTMLButtonElement | null;
  cssTab: HTMLButtonElement | null;
  htmlTab: HTMLButtonElement | null;
  previewPanel: HTMLElement | null;
  cssPanel: HTMLElement | null;
  htmlPanel: HTMLElement | null;
  
  // Value displays
  fontSizeValue: HTMLSpanElement | null;
  letterSpacingValue: HTMLSpanElement | null;
  paddingXValue: HTMLSpanElement | null;
  paddingYValue: HTMLSpanElement | null;
  borderWidthValue: HTMLSpanElement | null;
  borderRadiusValue: HTMLSpanElement | null;
  shadowXValue: HTMLSpanElement | null;
  shadowYValue: HTMLSpanElement | null;
  animationDurationValue: HTMLSpanElement | null;
}

export class NeobrutalismController extends BaseConverterController<NeobrutalismElements> {
  private activeTab: 'preview' | 'css' | 'html' = 'preview';
  
  protected initializeElements(): NeobrutalismElements {
    return {
      // Preview and outputs
      buttonPreview: this.safeGetElement<HTMLElement>('buttonPreview'),
      cssOutput: this.safeGetElement<HTMLTextAreaElement>('cssOutput'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('html-output'),
      copyBtn: this.safeGetElement<HTMLButtonElement>('copyBtn'),
      copyHtmlBtn: this.safeGetElement<HTMLButtonElement>('copy-html'),
      
      // Text controls
      buttonText: this.safeGetElement<HTMLInputElement>('button-text'),
      fontSize: this.safeGetElement<HTMLInputElement>('font-size'),
      fontWeight: this.safeGetElement<HTMLSelectElement>('font-weight'),
      textTransform: this.safeGetElement<HTMLSelectElement>('text-transform'),
      letterSpacing: this.safeGetElement<HTMLInputElement>('letter-spacing'),
      
      // Color controls
      backgroundColor: this.safeGetElement<HTMLInputElement>('background-color'),
      textColor: this.safeGetElement<HTMLInputElement>('text-color'),
      borderColor: this.safeGetElement<HTMLInputElement>('border-color'),
      shadowColor: this.safeGetElement<HTMLInputElement>('shadow-color'),
      
      // Dimension controls
      paddingX: this.safeGetElement<HTMLInputElement>('padding-x'),
      paddingY: this.safeGetElement<HTMLInputElement>('padding-y'),
      borderWidth: this.safeGetElement<HTMLInputElement>('border-width'),
      borderRadius: this.safeGetElement<HTMLInputElement>('border-radius'),
      shadowX: this.safeGetElement<HTMLInputElement>('shadow-x'),
      shadowY: this.safeGetElement<HTMLInputElement>('shadow-y'),
      
      // Animation controls
      hoverEffect: this.safeGetElement<HTMLSelectElement>('hover-effect'),
      animationDuration: this.safeGetElement<HTMLInputElement>('animation-duration'),
      
      // Tab controls
      previewTab: this.safeGetElement<HTMLButtonElement>('preview-tab'),
      cssTab: this.safeGetElement<HTMLButtonElement>('css-tab'),
      htmlTab: this.safeGetElement<HTMLButtonElement>('html-tab'),
      previewPanel: this.safeGetElement<HTMLElement>('preview-panel'),
      cssPanel: this.safeGetElement<HTMLElement>('css-panel'),
      htmlPanel: this.safeGetElement<HTMLElement>('html-panel'),
      
      // Value displays
      fontSizeValue: this.safeGetElement<HTMLSpanElement>('font-size-value'),
      letterSpacingValue: this.safeGetElement<HTMLSpanElement>('letter-spacing-value'),
      paddingXValue: this.safeGetElement<HTMLSpanElement>('padding-x-value'),
      paddingYValue: this.safeGetElement<HTMLSpanElement>('padding-y-value'),
      borderWidthValue: this.safeGetElement<HTMLSpanElement>('border-width-value'),
      borderRadiusValue: this.safeGetElement<HTMLSpanElement>('border-radius-value'),
      shadowXValue: this.safeGetElement<HTMLSpanElement>('shadow-x-value'),
      shadowYValue: this.safeGetElement<HTMLSpanElement>('shadow-y-value'),
      animationDurationValue: this.safeGetElement<HTMLSpanElement>('animation-duration-value')
    };
  }

  protected bindEvents(): void {
    if (!this.elements) return;

    // Text controls
    this.safeAddEventListener(this.elements.buttonText, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.fontSize, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.fontWeight, 'change', () => this.updateButton());
    this.safeAddEventListener(this.elements.textTransform, 'change', () => this.updateButton());
    this.safeAddEventListener(this.elements.letterSpacing, 'input', () => this.updateButton());

    // Color controls
    this.safeAddEventListener(this.elements.backgroundColor, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.textColor, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.borderColor, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.shadowColor, 'input', () => this.updateButton());

    // Dimension controls
    this.safeAddEventListener(this.elements.paddingX, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.paddingY, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.borderWidth, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.borderRadius, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.shadowX, 'input', () => this.updateButton());
    this.safeAddEventListener(this.elements.shadowY, 'input', () => this.updateButton());

    // Animation controls
    this.safeAddEventListener(this.elements.hoverEffect, 'change', () => this.updateButton());
    this.safeAddEventListener(this.elements.animationDuration, 'input', () => this.updateButton());

    // Range value updates
    this.safeAddEventListener(this.elements.fontSize, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.letterSpacing, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.paddingX, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.paddingY, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.borderWidth, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.borderRadius, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.shadowX, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.shadowY, 'input', () => this.updateRangeDisplays());
    this.safeAddEventListener(this.elements.animationDuration, 'input', () => this.updateRangeDisplays());

    // Tab controls
    this.safeAddEventListener(this.elements.previewTab, 'click', () => this.switchTab('preview'));
    this.safeAddEventListener(this.elements.cssTab, 'click', () => this.switchTab('css'));
    this.safeAddEventListener(this.elements.htmlTab, 'click', () => this.switchTab('html'));

    // Copy buttons
    this.safeAddEventListener(this.elements.copyBtn, 'click', (e) => {
      e.preventDefault();
      this.copyCSS();
    });
    this.safeAddEventListener(this.elements.copyHtmlBtn, 'click', (e) => {
      e.preventDefault();
      this.copyHTML();
    });

    // Preset buttons
    document.querySelectorAll('.preset-button').forEach(button => {
      this.safeAddEventListener(button as HTMLButtonElement, 'click', (e) => {
        const preset = (e.target as HTMLButtonElement).dataset.preset;
        if (preset) this.applyPreset(preset);
      });
    });
  }

  protected updateStats(): void {
    // No stats needed for this tool
  }

  protected getSampleInput(): string {
    return 'Click Me!';
  }

  protected onReady(): void {
    this.updateButton();
    this.updateRangeDisplays();
    this.updateOutputs();
  }

  private updateButton(): void {
    if (!this.elements?.buttonPreview) return;

    const button = this.elements.buttonPreview.querySelector('.neobrutalism-preview-button') as HTMLButtonElement;
    if (!button) return;

    // Get all values
    const text = this.elements.buttonText?.value || 'Click Me!';
    const fontSize = this.elements.fontSize?.value || '16';
    const fontWeight = this.elements.fontWeight?.value || '700';
    const textTransform = this.elements.textTransform?.value || 'uppercase';
    const letterSpacing = this.elements.letterSpacing?.value || '1';
    const backgroundColor = this.elements.backgroundColor?.value || '#FFEB3B';
    const textColor = this.elements.textColor?.value || '#000000';
    const borderColor = this.elements.borderColor?.value || '#000000';
    const shadowColor = this.elements.shadowColor?.value || '#000000';
    const paddingX = this.elements.paddingX?.value || '24';
    const paddingY = this.elements.paddingY?.value || '12';
    const borderWidth = this.elements.borderWidth?.value || '3';
    const borderRadius = this.elements.borderRadius?.value || '8';
    const shadowX = this.elements.shadowX?.value || '4';
    const shadowY = this.elements.shadowY?.value || '4';
    const animationDuration = this.elements.animationDuration?.value || '200';

    // Update button
    button.textContent = text;
    button.style.fontSize = `${fontSize}px`;
    button.style.fontWeight = fontWeight;
    button.style.textTransform = textTransform;
    button.style.letterSpacing = `${letterSpacing}px`;
    button.style.backgroundColor = backgroundColor;
    button.style.color = textColor;
    button.style.borderColor = borderColor;
    button.style.padding = `${paddingY}px ${paddingX}px`;
    button.style.borderWidth = `${borderWidth}px`;
    button.style.borderRadius = `${borderRadius}px`;
    button.style.boxShadow = `${shadowX}px ${shadowY}px 0 ${shadowColor}`;
    button.style.transition = `all ${animationDuration}ms ease`;

    // Remove existing event listeners by cloning
    const newButton = button.cloneNode(true) as HTMLButtonElement;
    button.parentNode?.replaceChild(newButton, button);

    // Add hover effect
    this.addHoverEffect(newButton, shadowX, shadowY, shadowColor, animationDuration);

    this.updateOutputs();
  }

  private addHoverEffect(button: HTMLButtonElement, shadowX: string, shadowY: string, shadowColor: string, duration: string): void {
    const hoverEffect = this.elements?.hoverEffect?.value || 'lift';

    button.addEventListener('mouseenter', () => {
      switch (hoverEffect) {
        case 'lift':
          button.style.transform = 'translate(-2px, -2px)';
          button.style.boxShadow = `${parseInt(shadowX) + 2}px ${parseInt(shadowY) + 2}px 0 ${shadowColor}`;
          break;
        case 'push':
          button.style.transform = 'translate(2px, 2px)';
          button.style.boxShadow = `${Math.max(parseInt(shadowX) - 2, 0)}px ${Math.max(parseInt(shadowY) - 2, 0)}px 0 ${shadowColor}`;
          break;
        case 'glow':
          button.style.boxShadow = `${shadowX}px ${shadowY}px 0 ${shadowColor}, 0 0 20px ${this.elements?.backgroundColor?.value || '#FFEB3B'}80`;
          break;
        case 'shake':
          button.style.animation = `shake ${duration}ms ease-in-out`;
          break;
      }
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.boxShadow = `${shadowX}px ${shadowY}px 0 ${shadowColor}`;
      button.style.animation = '';
    });

    button.addEventListener('mousedown', () => {
      button.style.transform = 'translate(2px, 2px)';
      button.style.boxShadow = `${Math.max(parseInt(shadowX) - 2, 0)}px ${Math.max(parseInt(shadowY) - 2, 0)}px 0 ${shadowColor}`;
    });

    button.addEventListener('mouseup', () => {
      button.style.transform = '';
      button.style.boxShadow = `${shadowX}px ${shadowY}px 0 ${shadowColor}`;
    });
  }

  private updateRangeDisplays(): void {
    if (!this.elements) return;

    const updates = [
      { element: this.elements.fontSizeValue, input: this.elements.fontSize, suffix: 'px' },
      { element: this.elements.letterSpacingValue, input: this.elements.letterSpacing, suffix: 'px' },
      { element: this.elements.paddingXValue, input: this.elements.paddingX, suffix: 'px' },
      { element: this.elements.paddingYValue, input: this.elements.paddingY, suffix: 'px' },
      { element: this.elements.borderWidthValue, input: this.elements.borderWidth, suffix: 'px' },
      { element: this.elements.borderRadiusValue, input: this.elements.borderRadius, suffix: 'px' },
      { element: this.elements.shadowXValue, input: this.elements.shadowX, suffix: 'px' },
      { element: this.elements.shadowYValue, input: this.elements.shadowY, suffix: 'px' },
      { element: this.elements.animationDurationValue, input: this.elements.animationDuration, suffix: 'ms' }
    ];

    updates.forEach(({ element, input, suffix }) => {
      if (element && input) {
        element.textContent = `${input.value}${suffix}`;
      }
    });
  }

  private updateOutputs(): void {
    this.generateCSS();
    this.generateHTML();
  }

  private generateCSS(): void {
    if (!this.elements?.cssOutput) return;

    const fontSize = this.elements.fontSize?.value || '16';
    const fontWeight = this.elements.fontWeight?.value || '700';
    const textTransform = this.elements.textTransform?.value || 'uppercase';
    const letterSpacing = this.elements.letterSpacing?.value || '1';
    const backgroundColor = this.elements.backgroundColor?.value || '#FFEB3B';
    const textColor = this.elements.textColor?.value || '#000000';
    const borderColor = this.elements.borderColor?.value || '#000000';
    const shadowColor = this.elements.shadowColor?.value || '#000000';
    const paddingX = this.elements.paddingX?.value || '24';
    const paddingY = this.elements.paddingY?.value || '12';
    const borderWidth = this.elements.borderWidth?.value || '3';
    const borderRadius = this.elements.borderRadius?.value || '8';
    const shadowX = this.elements.shadowX?.value || '4';
    const shadowY = this.elements.shadowY?.value || '4';
    const animationDuration = this.elements.animationDuration?.value || '200';
    const hoverEffect = this.elements.hoverEffect?.value || 'lift';

    let css = `.neobrutalism-button {
  background-color: ${backgroundColor};
  color: ${textColor};
  border: ${borderWidth}px solid ${borderColor};
  border-radius: ${borderRadius}px;
  padding: ${paddingY}px ${paddingX}px;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  text-transform: ${textTransform};
  letter-spacing: ${letterSpacing}px;
  box-shadow: ${shadowX}px ${shadowY}px 0 ${shadowColor};
  cursor: pointer;
  transition: all ${animationDuration}ms ease;
  text-decoration: none;
  display: inline-block;
  user-select: none;
  font-family: inherit;
}

.neobrutalism-button:hover {`;

    switch (hoverEffect) {
      case 'lift':
        css += `
  transform: translate(-2px, -2px);
  box-shadow: ${parseInt(shadowX) + 2}px ${parseInt(shadowY) + 2}px 0 ${shadowColor};`;
        break;
      case 'push':
        css += `
  transform: translate(2px, 2px);
  box-shadow: ${Math.max(parseInt(shadowX) - 2, 0)}px ${Math.max(parseInt(shadowY) - 2, 0)}px 0 ${shadowColor};`;
        break;
      case 'glow':
        css += `
  box-shadow: ${shadowX}px ${shadowY}px 0 ${shadowColor}, 0 0 20px ${backgroundColor}80;`;
        break;
      case 'shake':
        css += `
  animation: neobrutalism-shake ${animationDuration}ms ease-in-out;`;
        break;
    }

    css += `
}

.neobrutalism-button:active {
  transform: translate(2px, 2px);
  box-shadow: ${Math.max(parseInt(shadowX) - 2, 0)}px ${Math.max(parseInt(shadowY) - 2, 0)}px 0 ${shadowColor};
}`;

    if (hoverEffect === 'shake') {
      css += `

@keyframes neobrutalism-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}`;
    }

    this.elements.cssOutput.value = css;
  }

  private generateHTML(): void {
    if (!this.elements?.htmlOutput) return;

    const text = this.elements.buttonText?.value || 'Click Me!';
    const html = `<button class="neobrutalism-button">${text}</button>`;
    this.elements.htmlOutput.value = html;
  }

  private switchTab(tab: 'preview' | 'css' | 'html'): void {
    this.activeTab = tab;

    // Update tab buttons
    if (this.elements?.previewTab) this.elements.previewTab.classList.toggle('active', tab === 'preview');
    if (this.elements?.cssTab) this.elements.cssTab.classList.toggle('active', tab === 'css');
    if (this.elements?.htmlTab) this.elements.htmlTab.classList.toggle('active', tab === 'html');

    // Update panels
    if (this.elements?.previewPanel) this.elements.previewPanel.classList.toggle('hidden', tab !== 'preview');
    if (this.elements?.cssPanel) this.elements.cssPanel.classList.toggle('hidden', tab !== 'css');
    if (this.elements?.htmlPanel) this.elements.htmlPanel.classList.toggle('hidden', tab !== 'html');
  }

  private async copyCSS(): Promise<void> {
    if (!this.elements?.cssOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.cssOutput.value);
      this.showCopySuccess(this.elements.copyBtn);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private async copyHTML(): Promise<void> {
    if (!this.elements?.htmlOutput) return;

    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
      this.showCopySuccess(this.elements.copyHtmlBtn);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  private showCopySuccess(button: HTMLButtonElement | null): void {
    if (!button) return;
    
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    
    setTimeout(() => {
      if (originalText) {
        button.textContent = originalText;
      }
    }, 2000);
  }

  private applyPreset(preset: string): void {
    const presets: Record<string, any> = {
      electric: {
        backgroundColor: '#00ff00',
        textColor: '#000000',
        borderColor: '#ff00ff',
        shadowColor: '#00ffff',
        fontWeight: '800',
        textTransform: 'uppercase',
        hoverEffect: 'glow'
      },
      candy: {
        backgroundColor: '#ff69b4',
        textColor: '#ffffff',
        borderColor: '#ff1493',
        shadowColor: '#8b008b',
        fontWeight: '700',
        textTransform: 'lowercase',
        hoverEffect: 'lift'
      },
      midnight: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderColor: '#ffffff',
        shadowColor: '#666666',
        fontWeight: '600',
        textTransform: 'uppercase',
        hoverEffect: 'push'
      },
      sunset: {
        backgroundColor: '#ff6b35',
        textColor: '#000000',
        borderColor: '#000000',
        shadowColor: '#ff4500',
        fontWeight: '700',
        textTransform: 'capitalize',
        hoverEffect: 'shake'
      }
    };

    const config = presets[preset];
    if (!config || !this.elements) return;

    // Apply preset values
    if (this.elements.backgroundColor) this.elements.backgroundColor.value = config.backgroundColor;
    if (this.elements.textColor) this.elements.textColor.value = config.textColor;
    if (this.elements.borderColor) this.elements.borderColor.value = config.borderColor;
    if (this.elements.shadowColor) this.elements.shadowColor.value = config.shadowColor;
    if (this.elements.fontWeight) this.elements.fontWeight.value = config.fontWeight;
    if (this.elements.textTransform) this.elements.textTransform.value = config.textTransform;
    if (this.elements.hoverEffect) this.elements.hoverEffect.value = config.hoverEffect;

    this.updateButton();
  }
}