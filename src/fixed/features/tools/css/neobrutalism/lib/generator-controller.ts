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

  private safeGetElement<T extends HTMLElement>(id: string): T | null {
    try {
      return document.getElementById(id) as T | null;
    } catch (error) {
      console.warn(`Element with id "${id}" not found:`, error);
      return null;
    }
  }

  private initializeElements(): void {
    this.elements = {
      preview: this.safeGetElement('button-preview') || document.createElement('div'),
      cssOutput: this.safeGetElement('css-output') || document.createElement('textarea'),
      htmlOutput: this.safeGetElement('html-output') || document.createElement('textarea'),
      // Text inputs
      textInput: this.safeGetElement('button-text') || document.createElement('input'),
      fontSizeInput: this.safeGetElement('font-size') || document.createElement('input'),
      fontWeightSelect: this.safeGetElement('font-weight') || document.createElement('select'),
      fontFamilyInput: this.safeGetElement('font-family') || document.createElement('input'),
      textTransformSelect: this.safeGetElement('text-transform') || document.createElement('select'),
      letterSpacingInput: this.safeGetElement('letter-spacing') || document.createElement('input'),
      // Color inputs
      backgroundColorInput: this.safeGetElement('background-color') || document.createElement('input'),
      textColorInput: this.safeGetElement('text-color') || document.createElement('input'),
      borderColorInput: this.safeGetElement('border-color') || document.createElement('input'),
      shadowColorInput: this.safeGetElement('shadow-color') || document.createElement('input'),
      // Size inputs
      borderWidthInput: this.safeGetElement('border-width') || document.createElement('input'),
      shadowOffsetXInput: this.safeGetElement('shadow-offset-x') || document.createElement('input'),
      shadowOffsetYInput: this.safeGetElement('shadow-offset-y') || document.createElement('input'),
      borderRadiusInput: this.safeGetElement('border-radius') || document.createElement('input'),
      paddingXInput: this.safeGetElement('padding-x') || document.createElement('input'),
      paddingYInput: this.safeGetElement('padding-y') || document.createElement('input'),
      // Animation inputs
      hoverEffectSelect: this.safeGetElement('hover-effect') || document.createElement('select'),
      animationDurationInput: this.safeGetElement('animation-duration') || document.createElement('input'),
      // Range displays
      fontSizeValue: this.safeGetElement('font-size-value') || document.createElement('span'),
      borderWidthValue: this.safeGetElement('border-width-value') || document.createElement('span'),
      shadowOffsetXValue: this.safeGetElement('shadow-offset-x-value') || document.createElement('span'),
      shadowOffsetYValue: this.safeGetElement('shadow-offset-y-value') || document.createElement('span'),
      borderRadiusValue: this.safeGetElement('border-radius-value') || document.createElement('span'),
      paddingXValue: this.safeGetElement('padding-x-value') || document.createElement('span'),
      paddingYValue: this.safeGetElement('padding-y-value') || document.createElement('span'),
      letterSpacingValue: this.safeGetElement('letter-spacing-value') || document.createElement('span'),
      animationDurationValue: this.safeGetElement('animation-duration-value') || document.createElement('span')
    };

    this.tabElements = {
      previewTab: this.safeGetElement('preview-tab') || document.createElement('button'),
      cssTab: this.safeGetElement('css-tab') || document.createElement('button'),
      htmlTab: this.safeGetElement('html-tab') || document.createElement('button'),
      previewPanel: this.safeGetElement('preview-panel') || document.createElement('div'),
      cssPanel: this.safeGetElement('css-panel') || document.createElement('div'),
      htmlPanel: this.safeGetElement('html-panel') || document.createElement('div')
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

  private safeAddEventListener(
    element: HTMLElement | null,
    event: string,
    handler: EventListener
  ): void {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler);
    }
  }

  private bindEvents(): void {
    // Text inputs
    this.safeAddEventListener(this.elements.textInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.fontFamilyInput, 'input', () => this.updateConfig());
    
    // Color inputs
    this.safeAddEventListener(this.elements.backgroundColorInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.textColorInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.borderColorInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.shadowColorInput, 'input', () => this.updateConfig());
    
    // Range inputs
    this.safeAddEventListener(this.elements.fontSizeInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.borderWidthInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.shadowOffsetXInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.shadowOffsetYInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.borderRadiusInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.paddingXInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.paddingYInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.letterSpacingInput, 'input', () => this.updateConfig());
    this.safeAddEventListener(this.elements.animationDurationInput, 'input', () => this.updateConfig());
    
    // Select inputs
    this.safeAddEventListener(this.elements.fontWeightSelect, 'change', () => this.updateConfig());
    this.safeAddEventListener(this.elements.textTransformSelect, 'change', () => this.updateConfig());
    this.safeAddEventListener(this.elements.hoverEffectSelect, 'change', () => this.updateConfig());

    // Tab events
    this.safeAddEventListener(this.tabElements.previewTab, 'click', () => this.switchTab('preview'));
    this.safeAddEventListener(this.tabElements.cssTab, 'click', () => this.switchTab('css'));
    this.safeAddEventListener(this.tabElements.htmlTab, 'click', () => this.switchTab('html'));

    // Copy buttons
    const copyCSS = this.safeGetElement('copy-css');
    this.safeAddEventListener(copyCSS, 'click', () => this.copyCSS());

    const copyHTML = this.safeGetElement('copy-html');
    this.safeAddEventListener(copyHTML, 'click', () => this.copyHTML());

    const copyBoth = this.safeGetElement('copy-both');
    this.safeAddEventListener(copyBoth, 'click', () => this.copyBoth());

    // Preset buttons
    this.safeAddEventListener(this.safeGetElement('preset-primary'), 'click', () => this.loadPreset('primary'));
    this.safeAddEventListener(this.safeGetElement('preset-secondary'), 'click', () => this.loadPreset('secondary'));
    this.safeAddEventListener(this.safeGetElement('preset-danger'), 'click', () => this.loadPreset('danger'));
    this.safeAddEventListener(this.safeGetElement('preset-success'), 'click', () => this.loadPreset('success'));
    this.safeAddEventListener(this.safeGetElement('preset-warning'), 'click', () => this.loadPreset('warning'));
    this.safeAddEventListener(this.safeGetElement('preset-retro'), 'click', () => this.loadPreset('retro'));

    // Reset button
    const resetButton = this.safeGetElement('reset-button');
    this.safeAddEventListener(resetButton, 'click', () => this.resetToDefault());
  }

  private updateConfig(): void {
    this.currentConfig = {
      text: this.elements.textInput.value || 'Click Me',
      backgroundColor: this.elements.backgroundColorInput.value || '#FFEB3B',
      textColor: this.elements.textColorInput.value || '#000000',
      borderColor: this.elements.borderColorInput.value || '#000000',
      shadowColor: this.elements.shadowColorInput.value || '#000000',
      borderWidth: parseInt(this.elements.borderWidthInput.value) || 3,
      shadowOffsetX: parseInt(this.elements.shadowOffsetXInput.value) || 4,
      shadowOffsetY: parseInt(this.elements.shadowOffsetYInput.value) || 4,
      borderRadius: parseInt(this.elements.borderRadiusInput.value) || 8,
      fontSize: parseInt(this.elements.fontSizeInput.value) || 16,
      paddingX: parseInt(this.elements.paddingXInput.value) || 24,
      paddingY: parseInt(this.elements.paddingYInput.value) || 12,
      fontWeight: this.elements.fontWeightSelect.value as ButtonConfig['fontWeight'] || '700',
      fontFamily: this.elements.fontFamilyInput.value || 'Arial, sans-serif',
      textTransform: this.elements.textTransformSelect.value as ButtonConfig['textTransform'] || 'uppercase',
      letterSpacing: parseFloat(this.elements.letterSpacingInput.value) || 1,
      hoverEffect: this.elements.hoverEffectSelect.value as ButtonConfig['hoverEffect'] || 'lift',
      animationDuration: parseInt(this.elements.animationDurationInput.value) || 200
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

  private applyHoverEffect(button: HTMLElement): void {
    const config = this.currentConfig;
    
    switch (config.hoverEffect) {
      case 'lift':
        button.style.transform = 'translate(-2px, -2px)';
        button.style.boxShadow = `${config.shadowOffsetX + 2}px ${config.shadowOffsetY + 2}px 0 ${config.shadowColor}`;
        break;
      case 'push':
        button.style.transform = 'translate(2px, 2px)';
        button.style.boxShadow = `${config.shadowOffsetX - 2}px ${config.shadowOffsetY - 2}px 0 ${config.shadowColor}`;
        break;
      case 'glow':
        button.style.boxShadow = `${config.shadowOffsetX}px ${config.shadowOffsetY}px 0 ${config.shadowColor}, 0 0 20px ${config.backgroundColor}80`;
        break;
      case 'shake':
        button.style.animation = `neobrutalism-shake ${config.animationDuration}ms ease-in-out`;
        break;
      default:
        break;
    }
  }

  private removeHoverEffect(button: HTMLElement): void {
    const config = this.currentConfig;
    
    button.style.transform = '';
    button.style.boxShadow = `${config.shadowOffsetX}px ${config.shadowOffsetY}px 0 ${config.shadowColor}`;
    button.style.animation = '';
  }

  private applyActiveEffect(button: HTMLElement): void {
    const config = this.currentConfig;
    
    button.style.transform = `translate(${Math.floor(config.shadowOffsetX / 2)}px, ${Math.floor(config.shadowOffsetY / 2)}px)`;
    button.style.boxShadow = `${Math.floor(config.shadowOffsetX / 2)}px ${Math.floor(config.shadowOffsetY / 2)}px 0 ${config.shadowColor}`;
  }

  private removeActiveEffect(button: HTMLElement): void {
    // Return to hover state if still hovering, otherwise return to normal
    if (button.matches(':hover')) {
      this.applyHoverEffect(button);
    } else {
      this.removeHoverEffect(button);
    }
  }
  
  private updatePreview(): void {
    // Clear existing content
    this.elements.preview.innerHTML = '';
    
    // Create single button
    const button = document.createElement('button');
    button.textContent = this.currentConfig.text;
    button.className = 'neobrutalism-preview-button';
    
    // Apply styles
    const styles = this.generateButtonStyles();
    button.style.cssText = styles.inline;
    
    // Add event listeners for dynamic effects with proper binding
    button.addEventListener('mouseenter', () => {
      this.applyHoverEffect(button);
    });
    
    button.addEventListener('mouseleave', () => {
      this.removeHoverEffect(button);
    });
    
    button.addEventListener('mousedown', () => {
      this.applyActiveEffect(button);
    });
    
    button.addEventListener('mouseup', () => {
      this.removeActiveEffect(button);
    });

    // Prevent context menu to avoid stuck states
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Add to preview
    this.elements.preview.appendChild(button);
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
    const button = this.safeGetElement(buttonId);
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