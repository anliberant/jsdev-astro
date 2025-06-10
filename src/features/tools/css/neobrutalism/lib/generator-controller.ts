import type { ButtonConfig, ButtonPreset, GeneratorElements, TabElements } from '../types/button';

export class NeobrutalistmButtonController {
  private elements: GeneratorElements;
  private tabElements: TabElements;
  private currentConfig: ButtonConfig;
  private activeTab: 'preview' | 'css' | 'html' = 'preview';

  constructor() {
    this.currentConfig = this.getDefaultConfig();
    this.initializeElements();
    this.bindEvents();
    this.updatePreview();
    this.updateOutputs();
  }

  private getDefaultConfig(): ButtonConfig {
    return {
      text: 'Click Me',
      backgroundColor: '#FFEB3B',
      textColor: '#000000',
      borderColor: '#000000',
      shadowColor: '#000000',
      borderWidth: 3,
      shadowOffsetX: 4,
      shadowOffsetY: 4,
      borderRadius: 8,
      fontSize: 16,
      paddingX: 24,
      paddingY: 12,
      fontWeight: '700',
      fontFamily: 'Arial, sans-serif',
      textTransform: 'uppercase',
      letterSpacing: 1,
      hoverEffect: 'lift',
      animationDuration: 200
    };
  }

  private initializeElements(): void {
    this.elements = {
      preview: document.getElementById('button-preview') as HTMLElement,
      cssOutput: document.getElementById('css-output') as HTMLTextAreaElement,
      htmlOutput: document.getElementById('html-output') as HTMLTextAreaElement,
      // Text inputs
      textInput: document.getElementById('button-text') as HTMLInputElement,
      fontSizeInput: document.getElementById('font-size') as HTMLInputElement,
      fontWeightSelect: document.getElementById('font-weight') as HTMLSelectElement,
      fontFamilyInput: document.getElementById('font-family') as HTMLInputElement,
      textTransformSelect: document.getElementById('text-transform') as HTMLSelectElement,
      letterSpacingInput: document.getElementById('letter-spacing') as HTMLInputElement,
      // Color inputs
      backgroundColorInput: document.getElementById('background-color') as HTMLInputElement,
      textColorInput: document.getElementById('text-color') as HTMLInputElement,
      borderColorInput: document.getElementById('border-color') as HTMLInputElement,
      shadowColorInput: document.getElementById('shadow-color') as HTMLInputElement,
      // Size inputs
      borderWidthInput: document.getElementById('border-width') as HTMLInputElement,
      shadowOffsetXInput: document.getElementById('shadow-offset-x') as HTMLInputElement,
      shadowOffsetYInput: document.getElementById('shadow-offset-y') as HTMLInputElement,
      borderRadiusInput: document.getElementById('border-radius') as HTMLInputElement,
      paddingXInput: document.getElementById('padding-x') as HTMLInputElement,
      paddingYInput: document.getElementById('padding-y') as HTMLInputElement,
      // Animation inputs
      hoverEffectSelect: document.getElementById('hover-effect') as HTMLSelectElement,
      animationDurationInput: document.getElementById('animation-duration') as HTMLInputElement,
      // Range displays
      fontSizeValue: document.getElementById('font-size-value') as HTMLElement,
      borderWidthValue: document.getElementById('border-width-value') as HTMLElement,
      shadowOffsetXValue: document.getElementById('shadow-offset-x-value') as HTMLElement,
      shadowOffsetYValue: document.getElementById('shadow-offset-y-value') as HTMLElement,
      borderRadiusValue: document.getElementById('border-radius-value') as HTMLElement,
      paddingXValue: document.getElementById('padding-x-value') as HTMLElement,
      paddingYValue: document.getElementById('padding-y-value') as HTMLElement,
      letterSpacingValue: document.getElementById('letter-spacing-value') as HTMLElement,
      animationDurationValue: document.getElementById('animation-duration-value') as HTMLElement
    };

    this.tabElements = {
      previewTab: document.getElementById('preview-tab') as HTMLButtonElement,
      cssTab: document.getElementById('css-tab') as HTMLButtonElement,
      htmlTab: document.getElementById('html-tab') as HTMLButtonElement,
      previewPanel: document.getElementById('preview-panel') as HTMLElement,
      cssPanel: document.getElementById('css-panel') as HTMLElement,
      htmlPanel: document.getElementById('html-panel') as HTMLElement
    };

    this.initializeInputValues();
  }

  private initializeInputValues(): void {
    this.elements.textInput.value = this.currentConfig.text;
    this.elements.backgroundColorInput.value = this.currentConfig.backgroundColor;
    this.elements.textColorInput.value = this.currentConfig.textColor;
    this.elements.borderColorInput.value = this.currentConfig.borderColor;
    this.elements.shadowColorInput.value = this.currentConfig.shadowColor;
    this.elements.fontSizeInput.value = this.currentConfig.fontSize.toString();
    this.elements.borderWidthInput.value = this.currentConfig.borderWidth.toString();
    this.elements.shadowOffsetXInput.value = this.currentConfig.shadowOffsetX.toString();
    this.elements.shadowOffsetYInput.value = this.currentConfig.shadowOffsetY.toString();
    this.elements.borderRadiusInput.value = this.currentConfig.borderRadius.toString();
    this.elements.paddingXInput.value = this.currentConfig.paddingX.toString();
    this.elements.paddingYInput.value = this.currentConfig.paddingY.toString();
    this.elements.fontWeightSelect.value = this.currentConfig.fontWeight;
    this.elements.fontFamilyInput.value = this.currentConfig.fontFamily;
    this.elements.textTransformSelect.value = this.currentConfig.textTransform;
    this.elements.letterSpacingInput.value = this.currentConfig.letterSpacing.toString();
    this.elements.hoverEffectSelect.value = this.currentConfig.hoverEffect;
    this.elements.animationDurationInput.value = this.currentConfig.animationDuration.toString();

    this.updateRangeDisplays();
  }

  private bindEvents(): void {
    // Text inputs
    this.elements.textInput.addEventListener('input', () => this.updateConfig());
    this.elements.fontFamilyInput.addEventListener('input', () => this.updateConfig());
    
    // Color inputs
    this.elements.backgroundColorInput.addEventListener('input', () => this.updateConfig());
    this.elements.textColorInput.addEventListener('input', () => this.updateConfig());
    this.elements.borderColorInput.addEventListener('input', () => this.updateConfig());
    this.elements.shadowColorInput.addEventListener('input', () => this.updateConfig());
    
    // Range inputs
    this.elements.fontSizeInput.addEventListener('input', () => this.updateConfig());
    this.elements.borderWidthInput.addEventListener('input', () => this.updateConfig());
    this.elements.shadowOffsetXInput.addEventListener('input', () => this.updateConfig());
    this.elements.shadowOffsetYInput.addEventListener('input', () => this.updateConfig());
    this.elements.borderRadiusInput.addEventListener('input', () => this.updateConfig());
    this.elements.paddingXInput.addEventListener('input', () => this.updateConfig());
    this.elements.paddingYInput.addEventListener('input', () => this.updateConfig());
    this.elements.letterSpacingInput.addEventListener('input', () => this.updateConfig());
    this.elements.animationDurationInput.addEventListener('input', () => this.updateConfig());
    
    // Select inputs
    this.elements.fontWeightSelect.addEventListener('change', () => this.updateConfig());
    this.elements.textTransformSelect.addEventListener('change', () => this.updateConfig());
    this.elements.hoverEffectSelect.addEventListener('change', () => this.updateConfig());

    // Tab events
    this.tabElements.previewTab.addEventListener('click', () => this.switchTab('preview'));
    this.tabElements.cssTab.addEventListener('click', () => this.switchTab('css'));
    this.tabElements.htmlTab.addEventListener('click', () => this.switchTab('html'));

    // Copy buttons
    document.getElementById('copy-css')?.addEventListener('click', () => this.copyCSS());
    document.getElementById('copy-html')?.addEventListener('click', () => this.copyHTML());
    document.getElementById('copy-both')?.addEventListener('click', () => this.copyBoth());

    // Preset buttons
    document.getElementById('preset-primary')?.addEventListener('click', () => this.loadPreset('primary'));
    document.getElementById('preset-secondary')?.addEventListener('click', () => this.loadPreset('secondary'));
    document.getElementById('preset-danger')?.addEventListener('click', () => this.loadPreset('danger'));
    document.getElementById('preset-success')?.addEventListener('click', () => this.loadPreset('success'));
    document.getElementById('preset-warning')?.addEventListener('click', () => this.loadPreset('warning'));
    document.getElementById('preset-retro')?.addEventListener('click', () => this.loadPreset('retro'));

    // Reset button
    document.getElementById('reset-button')?.addEventListener('click', () => this.resetToDefault());
  }

  private updateConfig(): void {
    this.currentConfig = {
      text: this.elements.textInput.value,
      backgroundColor: this.elements.backgroundColorInput.value,
      textColor: this.elements.textColorInput.value,
      borderColor: this.elements.borderColorInput.value,
      shadowColor: this.elements.shadowColorInput.value,
      borderWidth: parseInt(this.elements.borderWidthInput.value),
      shadowOffsetX: parseInt(this.elements.shadowOffsetXInput.value),
      shadowOffsetY: parseInt(this.elements.shadowOffsetYInput.value),
      borderRadius: parseInt(this.elements.borderRadiusInput.value),
      fontSize: parseInt(this.elements.fontSizeInput.value),
      paddingX: parseInt(this.elements.paddingXInput.value),
      paddingY: parseInt(this.elements.paddingYInput.value),
      fontWeight: this.elements.fontWeightSelect.value as ButtonConfig['fontWeight'],
      fontFamily: this.elements.fontFamilyInput.value,
      textTransform: this.elements.textTransformSelect.value as ButtonConfig['textTransform'],
      letterSpacing: parseFloat(this.elements.letterSpacingInput.value),
      hoverEffect: this.elements.hoverEffectSelect.value as ButtonConfig['hoverEffect'],
      animationDuration: parseInt(this.elements.animationDurationInput.value)
    };

    this.updateRangeDisplays();
    this.updatePreview();
    this.updateOutputs();
  }

  private updateRangeDisplays(): void {
    this.elements.fontSizeValue.textContent = `${this.currentConfig.fontSize}px`;
    this.elements.borderWidthValue.textContent = `${this.currentConfig.borderWidth}px`;
    this.elements.shadowOffsetXValue.textContent = `${this.currentConfig.shadowOffsetX}px`;
    this.elements.shadowOffsetYValue.textContent = `${this.currentConfig.shadowOffsetY}px`;
    this.elements.borderRadiusValue.textContent = `${this.currentConfig.borderRadius}px`;
    this.elements.paddingXValue.textContent = `${this.currentConfig.paddingX}px`;
    this.elements.paddingYValue.textContent = `${this.currentConfig.paddingY}px`;
    this.elements.letterSpacingValue.textContent = `${this.currentConfig.letterSpacing}px`;
    this.elements.animationDurationValue.textContent = `${this.currentConfig.animationDuration}ms`;
  }

  private updatePreview(): void {
    const buttons = this.elements.preview.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    
    buttons.forEach((button, index) => {
      // Main button gets the full text, others get abbreviated text
      if (index === 0) {
        button.textContent = this.currentConfig.text;
      } else {
        const texts = ['Normal', 'Hover', 'Active', 'Large'];
        if (texts[index - 1]) {
          button.textContent = texts[index - 1];
        }
      }
    });
    
    const styles = this.generateButtonStyles();
    
    buttons.forEach((button, index) => {
      let buttonStyles = styles.inline;
      
      // Apply size variations
      if (index === 1 || index === 2 || index === 3) { // Small buttons
        buttonStyles += `; font-size: 12px; padding: 8px 16px; box-shadow: 2px 2px 0 ${this.currentConfig.shadowColor}`;
      } else if (index === 4) { // Large button
        buttonStyles += `; font-size: 18px; padding: 16px 32px; box-shadow: 6px 6px 0 ${this.currentConfig.shadowColor}`;
      }
      
      // Active state for button 3
      if (index === 3) {
        const offsetX = Math.floor(this.currentConfig.shadowOffsetX / 2);
        const offsetY = Math.floor(this.currentConfig.shadowOffsetY / 2);
        buttonStyles += `; transform: translate(${offsetX}px, ${offsetY}px); box-shadow: ${offsetX}px ${offsetY}px 0 ${this.currentConfig.shadowColor}`;
      }
      
      button.style.cssText = buttonStyles;
      
      // Update hover effect classes
      button.className = `neobrutalism-button hover-${index === 2 ? 'none' : this.currentConfig.hoverEffect}`;
      if (index === 3) button.classList.add('active-state');
      if (index === 1 || index === 2 || index === 3) button.classList.add('btn-small');
      if (index === 4) button.classList.add('btn-large');
    });
  }

  private generateButtonStyles(): { css: string; inline: string } {
    const config = this.currentConfig;
    
    const baseStyles = `
      background-color: ${config.backgroundColor};
      color: ${config.textColor};
      border: ${config.borderWidth}px solid ${config.borderColor};
      border-radius: ${config.borderRadius}px;
      padding: ${config.paddingY}px ${config.paddingX}px;
      font-size: ${config.fontSize}px;
      font-weight: ${config.fontWeight};
      font-family: ${config.fontFamily};
      text-transform: ${config.textTransform};
      letter-spacing: ${config.letterSpacing}px;
      box-shadow: ${config.shadowOffsetX}px ${config.shadowOffsetY}px 0 ${config.shadowColor};
      cursor: pointer;
      transition: all ${config.animationDuration}ms ease;
      text-decoration: none;
      display: inline-block;
      user-select: none;
    `;

    const hoverStyles = this.generateHoverStyles();

    const css = `.neobrutalism-button {${baseStyles}}

.neobrutalism-button:hover {${hoverStyles}}

.neobrutalism-button:active {
  transform: translate(${Math.floor(config.shadowOffsetX / 2)}px, ${Math.floor(config.shadowOffsetY / 2)}px);
  box-shadow: ${Math.floor(config.shadowOffsetX / 2)}px ${Math.floor(config.shadowOffsetY / 2)}px 0 ${config.shadowColor};
}`;

    const inline = baseStyles.replace(/\n\s+/g, ' ').trim();

    return { css, inline };
  }

  private generateHoverStyles(): string {
    const config = this.currentConfig;
    
    switch (config.hoverEffect) {
      case 'lift':
        return `
          transform: translate(-2px, -2px);
          box-shadow: ${config.shadowOffsetX + 2}px ${config.shadowOffsetY + 2}px 0 ${config.shadowColor};
        `;
      case 'push':
        return `
          transform: translate(2px, 2px);
          box-shadow: ${config.shadowOffsetX - 2}px ${config.shadowOffsetY - 2}px 0 ${config.shadowColor};
        `;
      case 'glow':
        return `
          box-shadow: ${config.shadowOffsetX}px ${config.shadowOffsetY}px 0 ${config.shadowColor}, 
                      0 0 20px ${config.backgroundColor}80;
        `;
      case 'shake':
        return `
          animation: neobrutalism-shake ${config.animationDuration}ms ease-in-out;
        `;
      default:
        return '';
    }
  }

  private updateOutputs(): void {
    const styles = this.generateButtonStyles();
    const html = this.generateHTML();

    this.elements.cssOutput.value = this.generateFullCSS();
    this.elements.htmlOutput.value = html;
  }

  private generateHTML(): string {
    return `<button class="neobrutalism-button">${this.currentConfig.text}</button>`;
  }

  private generateFullCSS(): string {
    const styles = this.generateButtonStyles();
    let css = styles.css;

    if (this.currentConfig.hoverEffect === 'shake') {
      css += `

@keyframes neobrutalism-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}`;
    }

    return css;
  }

  private switchTab(tab: 'preview' | 'css' | 'html'): void {
    this.activeTab = tab;

    // Update tab buttons
    this.tabElements.previewTab.classList.toggle('active', tab === 'preview');
    this.tabElements.cssTab.classList.toggle('active', tab === 'css');
    this.tabElements.htmlTab.classList.toggle('active', tab === 'html');

    // Update panels
    this.tabElements.previewPanel.classList.toggle('hidden', tab !== 'preview');
    this.tabElements.cssPanel.classList.toggle('hidden', tab !== 'css');
    this.tabElements.htmlPanel.classList.toggle('hidden', tab !== 'html');
  }

  private async copyCSS(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.elements.cssOutput.value);
      this.showCopySuccess('copy-css');
    } catch (error) {
      console.error('Failed to copy CSS:', error);
    }
  }

  private async copyHTML(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
      this.showCopySuccess('copy-html');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
    }
  }

  private async copyBoth(): Promise<void> {
    try {
      const combined = `${this.elements.htmlOutput.value}\n\n<style>\n${this.elements.cssOutput.value}\n</style>`;
      await navigator.clipboard.writeText(combined);
      this.showCopySuccess('copy-both');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }

  private showCopySuccess(buttonId: string): void {
    const button = document.getElementById(buttonId);
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }
  }

  private getPresets(): Record<string, ButtonPreset> {
    return {
      primary: {
        name: 'Primary',
        description: 'Bold primary button',
        config: {
          ...this.getDefaultConfig(),
          text: 'Primary Button',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
          borderColor: '#1E40AF',
          shadowColor: '#1E40AF'
        }
      },
      secondary: {
        name: 'Secondary',
        description: 'Subtle secondary button',
        config: {
          ...this.getDefaultConfig(),
          text: 'Secondary',
          backgroundColor: '#6B7280',
          textColor: '#FFFFFF',
          borderColor: '#374151',
          shadowColor: '#374151'
        }
      },
      danger: {
        name: 'Danger',
        description: 'Warning/danger button',
        config: {
          ...this.getDefaultConfig(),
          text: 'Delete',
          backgroundColor: '#EF4444',
          textColor: '#FFFFFF',
          borderColor: '#DC2626',
          shadowColor: '#DC2626'
        }
      },
      success: {
        name: 'Success',
        description: 'Success/confirmation button',
        config: {
          ...this.getDefaultConfig(),
          text: 'Success',
          backgroundColor: '#10B981',
          textColor: '#FFFFFF',
          borderColor: '#059669',
          shadowColor: '#059669'
        }
      },
      warning: {
        name: 'Warning',
        description: 'Warning/caution button',
        config: {
          ...this.getDefaultConfig(),
          text: 'Warning',
          backgroundColor: '#F59E0B',
          textColor: '#000000',
          borderColor: '#D97706',
          shadowColor: '#D97706'
        }
      },
      retro: {
        name: 'Retro',
        description: 'Retro gaming style',
        config: {
          ...this.getDefaultConfig(),
          text: 'RETRO',
          backgroundColor: '#FF00FF',
          textColor: '#00FFFF',
          borderColor: '#000000',
          shadowColor: '#00FFFF',
          borderWidth: 4,
          shadowOffsetX: 6,
          shadowOffsetY: 6,
          fontFamily: 'Courier New, monospace',
          letterSpacing: 2
        }
      }
    };
  }

  private loadPreset(presetName: string): void {
    const presets = this.getPresets();
    const preset = presets[presetName];
    
    if (preset) {
      this.currentConfig = { ...preset.config };
      this.initializeInputValues();
      this.updatePreview();
      this.updateOutputs();
    }
  }

  private resetToDefault(): void {
    this.currentConfig = this.getDefaultConfig();
    this.initializeInputValues();
    this.updatePreview();
    this.updateOutputs();
  }
}