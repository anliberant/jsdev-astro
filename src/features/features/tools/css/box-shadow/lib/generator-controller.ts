import type { BoxShadowConfig, BoxShadowPreset, GeneratorElements, TabElements, PreviewConfig } from '../types/shadow';

export class BoxShadowGeneratorController {
  private elements: GeneratorElements;
  private tabElements: TabElements;
  private shadows: BoxShadowConfig[] = [];
  private activeShadowId: string | null = null;
  private activeTab: 'preview' | 'css' | 'html' = 'preview';
  private previewConfig: PreviewConfig;
  private shadowCounter = 0;

  constructor() {
    this.previewConfig = this.getDefaultPreviewConfig();
    this.initializeElements();
    this.bindEvents();
    this.addDefaultShadow();
    this.updatePreview();
    this.updateOutputs();
  }

  private getDefaultPreviewConfig(): PreviewConfig {
    return {
      width: 200,
      height: 120,
      backgroundColor: '#ffffff',
      shape: 'rectangle'
    };
  }

  private getDefaultShadow(): Omit<BoxShadowConfig, 'id'> {
    return {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 8,
      spreadRadius: 0,
      color: '#000000',
      opacity: 0.25,
      inset: false
    };
  }

  private safeGetElement<T extends HTMLElement>(id: string): T | null {
    try {
      return document.getElementById(id) as T | null;
    } catch (error) {
      // removed log: console.warn(`Element with id "${id}" not found:`, error);
      return null;
    }
  }

  private initializeElements(): void {
    this.elements = {
      preview: this.safeGetElement('shadow-preview') || document.createElement('div'),
      cssOutput: this.safeGetElement('css-output') || document.createElement('textarea'),
      htmlOutput: this.safeGetElement('html-output') || document.createElement('textarea'),
      shadowsList: this.safeGetElement('shadows-list') || document.createElement('div'),
      addShadowBtn: this.safeGetElement('add-shadow-btn') || document.createElement('button'),
      // Shadow controls
      offsetXInput: this.safeGetElement('offset-x') || document.createElement('input'),
      offsetYInput: this.safeGetElement('offset-y') || document.createElement('input'),
      blurRadiusInput: this.safeGetElement('blur-radius') || document.createElement('input'),
      spreadRadiusInput: this.safeGetElement('spread-radius') || document.createElement('input'),
      colorInput: this.safeGetElement('shadow-color') || document.createElement('input'),
      opacityInput: this.safeGetElement('shadow-opacity') || document.createElement('input'),
      insetCheckbox: this.safeGetElement('inset-shadow') || document.createElement('input'),
      // Range displays
      offsetXValue: this.safeGetElement('offset-x-value') || document.createElement('span'),
      offsetYValue: this.safeGetElement('offset-y-value') || document.createElement('span'),
      blurRadiusValue: this.safeGetElement('blur-radius-value') || document.createElement('span'),
      spreadRadiusValue: this.safeGetElement('spread-radius-value') || document.createElement('span'),
      opacityValue: this.safeGetElement('opacity-value') || document.createElement('span'),
      // Preview customization
      previewWidthInput: this.safeGetElement('preview-width') || document.createElement('input'),
      previewHeightInput: this.safeGetElement('preview-height') || document.createElement('input'),
      previewBgColorInput: this.safeGetElement('preview-bg-color') || document.createElement('input'),
      previewShapeSelect: this.safeGetElement('preview-shape') || document.createElement('select')
    };

    this.tabElements = {
      previewTab: this.safeGetElement('preview-tab') || document.createElement('button'),
      cssTab: this.safeGetElement('css-tab') || document.createElement('button'),
      htmlTab: this.safeGetElement('html-tab') || document.createElement('button'),
      previewPanel: this.safeGetElement('preview-panel') || document.createElement('div'),
      cssPanel: this.safeGetElement('css-panel') || document.createElement('div'),
      htmlPanel: this.safeGetElement('html-panel') || document.createElement('div')
    };

    this.initializePreviewInputValues();
  }

  private initializePreviewInputValues(): void {
    this.elements.previewWidthInput.value = this.previewConfig.width.toString();
    this.elements.previewHeightInput.value = this.previewConfig.height.toString();
    this.elements.previewBgColorInput.value = this.previewConfig.backgroundColor;
    this.elements.previewShapeSelect.value = this.previewConfig.shape;
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
    // Add shadow button
    this.safeAddEventListener(this.elements.addShadowBtn, 'click', () => this.addShadow());

    // Shadow control inputs
    this.safeAddEventListener(this.elements.offsetXInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.offsetYInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.blurRadiusInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.spreadRadiusInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.colorInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.opacityInput, 'input', () => this.updateActiveShadow());
    this.safeAddEventListener(this.elements.insetCheckbox, 'change', () => this.updateActiveShadow());

    // Preview customization
    this.safeAddEventListener(this.elements.previewWidthInput, 'input', () => this.updatePreviewConfig());
    this.safeAddEventListener(this.elements.previewHeightInput, 'input', () => this.updatePreviewConfig());
    this.safeAddEventListener(this.elements.previewBgColorInput, 'input', () => this.updatePreviewConfig());
    this.safeAddEventListener(this.elements.previewShapeSelect, 'change', () => this.updatePreviewConfig());

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
    this.safeAddEventListener(this.safeGetElement('preset-soft'), 'click', () => this.loadPreset('soft'));
    this.safeAddEventListener(this.safeGetElement('preset-material'), 'click', () => this.loadPreset('material'));
    this.safeAddEventListener(this.safeGetElement('preset-hard'), 'click', () => this.loadPreset('hard'));
    this.safeAddEventListener(this.safeGetElement('preset-inset'), 'click', () => this.loadPreset('inset'));
    this.safeAddEventListener(this.safeGetElement('preset-colored'), 'click', () => this.loadPreset('colored'));
    this.safeAddEventListener(this.safeGetElement('preset-multi'), 'click', () => this.loadPreset('multi'));

    // Reset button
    const resetButton = this.safeGetElement('reset-button');
    this.safeAddEventListener(resetButton, 'click', () => this.resetToDefault());
  }

  private addDefaultShadow(): void {
    const defaultShadow = this.getDefaultShadow();
    this.addShadowFromConfig(defaultShadow);
  }

  private addShadow(): void {
    const newShadow = this.getDefaultShadow();
    this.addShadowFromConfig(newShadow);
  }

  private addShadowFromConfig(config: Omit<BoxShadowConfig, 'id'>): void {
    const id = `shadow-${++this.shadowCounter}`;
    const shadow: BoxShadowConfig = { ...config, id };
    this.shadows.push(shadow);
    this.activeShadowId = id;
    this.renderShadowsList();
    this.updateInputsFromActiveShadow();
    this.updatePreview();
    this.updateOutputs();
  }

  private renderShadowsList(): void {
    this.elements.shadowsList.innerHTML = '';
    
    this.shadows.forEach((shadow, index) => {
      const shadowItem = document.createElement('div');
      shadowItem.className = `shadow-item ${shadow.id === this.activeShadowId ? 'active' : ''}`;
      shadowItem.innerHTML = `
        <div class="shadow-item-header">
          <span class="shadow-name">Shadow ${index + 1}</span>
          <div class="shadow-actions">
            <button class="shadow-duplicate-btn" data-id="${shadow.id}" title="Duplicate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="shadow-delete-btn" data-id="${shadow.id}" title="Delete" ${this.shadows.length === 1 ? 'disabled' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18l-2 13H5L3 6z"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="shadow-preview-mini">
          <div class="mini-box" style="box-shadow: ${this.generateSingleShadowCSS(shadow)}"></div>
        </div>
        <div class="shadow-info">
          <small>${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px</small>
        </div>
      `;
      
      shadowItem.addEventListener('click', () => this.selectShadow(shadow.id));
      
      const duplicateBtn = shadowItem.querySelector('.shadow-duplicate-btn');
      duplicateBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.duplicateShadow(shadow.id);
      });
      
      const deleteBtn = shadowItem.querySelector('.shadow-delete-btn');
      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteShadow(shadow.id);
      });
      
      this.elements.shadowsList.appendChild(shadowItem);
    });
  }

  private selectShadow(id: string): void {
    this.activeShadowId = id;
    this.renderShadowsList();
    this.updateInputsFromActiveShadow();
  }

  private duplicateShadow(id: string): void {
    const shadow = this.shadows.find(s => s.id === id);
    if (shadow) {
      const { id: _, ...config } = shadow;
      this.addShadowFromConfig(config);
    }
  }

  private deleteShadow(id: string): void {
    if (this.shadows.length === 1) return;
    
    const index = this.shadows.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shadows.splice(index, 1);
      
      if (this.activeShadowId === id) {
        const newIndex = Math.min(index, this.shadows.length - 1);
        this.activeShadowId = this.shadows[newIndex]?.id || null;
      }
      
      this.renderShadowsList();
      this.updateInputsFromActiveShadow();
      this.updatePreview();
      this.updateOutputs();
    }
  }

  private updateInputsFromActiveShadow(): void {
    const shadow = this.shadows.find(s => s.id === this.activeShadowId);
    if (!shadow) return;

    this.elements.offsetXInput.value = shadow.offsetX.toString();
    this.elements.offsetYInput.value = shadow.offsetY.toString();
    this.elements.blurRadiusInput.value = shadow.blurRadius.toString();
    this.elements.spreadRadiusInput.value = shadow.spreadRadius.toString();
    this.elements.colorInput.value = shadow.color;
    this.elements.opacityInput.value = shadow.opacity.toString();
    this.elements.insetCheckbox.checked = shadow.inset;

    this.updateRangeDisplays();
  }

  private updateActiveShadow(): void {
    const shadow = this.shadows.find(s => s.id === this.activeShadowId);
    if (!shadow) return;

    shadow.offsetX = parseInt(this.elements.offsetXInput.value) || 0;
    shadow.offsetY = parseInt(this.elements.offsetYInput.value) || 0;
    shadow.blurRadius = parseInt(this.elements.blurRadiusInput.value) || 0;
    shadow.spreadRadius = parseInt(this.elements.spreadRadiusInput.value) || 0;
    shadow.color = this.elements.colorInput.value || '#000000';
    shadow.opacity = parseFloat(this.elements.opacityInput.value) || 0;
    shadow.inset = this.elements.insetCheckbox.checked;

    this.updateRangeDisplays();
    this.renderShadowsList();
    this.updatePreview();
    this.updateOutputs();
  }

  private updateRangeDisplays(): void {
    this.elements.offsetXValue.textContent = `${this.elements.offsetXInput.value}px`;
    this.elements.offsetYValue.textContent = `${this.elements.offsetYInput.value}px`;
    this.elements.blurRadiusValue.textContent = `${this.elements.blurRadiusInput.value}px`;
    this.elements.spreadRadiusValue.textContent = `${this.elements.spreadRadiusInput.value}px`;
    this.elements.opacityValue.textContent = `${Math.round(parseFloat(this.elements.opacityInput.value) * 100)}%`;
  }

  private updatePreviewConfig(): void {
    this.previewConfig.width = parseInt(this.elements.previewWidthInput.value) || 200;
    this.previewConfig.height = parseInt(this.elements.previewHeightInput.value) || 120;
    this.previewConfig.backgroundColor = this.elements.previewBgColorInput.value || '#ffffff';
    this.previewConfig.shape = this.elements.previewShapeSelect.value as PreviewConfig['shape'] || 'rectangle';
    
    this.updatePreview();
  }

  private updatePreview(): void {
    const boxShadows = this.shadows.map(shadow => this.generateSingleShadowCSS(shadow)).join(', ');
    
    const previewBox = this.elements.preview.querySelector('.preview-box') as HTMLElement;
    if (previewBox) {
      previewBox.style.boxShadow = boxShadows;
      previewBox.style.width = `${this.previewConfig.width}px`;
      previewBox.style.height = `${this.previewConfig.height}px`;
      previewBox.style.backgroundColor = this.previewConfig.backgroundColor;
      
      switch (this.previewConfig.shape) {
        case 'circle':
          previewBox.style.borderRadius = '50%';
          break;
        case 'rounded':
          previewBox.style.borderRadius = '12px';
          break;
        default:
          previewBox.style.borderRadius = '0';
      }
    }
  }

  private generateSingleShadowCSS(shadow: BoxShadowConfig): string {
    const { offsetX, offsetY, blurRadius, spreadRadius, color, opacity, inset } = shadow;
    
    // Convert hex color to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    
    const insetPrefix = inset ? 'inset ' : '';
    return `${insetPrefix}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgba}`;
  }

  private generateBoxShadowCSS(): string {
    const shadows = this.shadows.map(shadow => this.generateSingleShadowCSS(shadow));
    return shadows.join(',\n    ');
  }

  private updateOutputs(): void {
    const boxShadows = this.generateBoxShadowCSS();
    const css = `.element {
  box-shadow: ${boxShadows};
}`;

    const html = `<div class="element">Your content here</div>`;

    this.elements.cssOutput.value = css;
    this.elements.htmlOutput.value = html;
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
      // removed log: console.error('Failed to copy CSS:', error);
    }
  }

  private async copyHTML(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.elements.htmlOutput.value);
      this.showCopySuccess('copy-html');
    } catch (error) {
      // removed log: console.error('Failed to copy HTML:', error);
    }
  }

  private async copyBoth(): Promise<void> {
    try {
      const combined = `${this.elements.htmlOutput.value}\n\n<style>\n${this.elements.cssOutput.value}\n</style>`;
      await navigator.clipboard.writeText(combined);
      this.showCopySuccess('copy-both');
    } catch (error) {
      // removed log: console.error('Failed to copy code:', error);
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

  private getPresets(): Record<string, BoxShadowPreset> {
    return {
      soft: {
        name: 'Soft Shadow',
        description: 'Subtle, elegant shadow',
        shadows: [
          { offsetX: 0, offsetY: 2, blurRadius: 8, spreadRadius: 0, color: '#000000', opacity: 0.15, inset: false }
        ]
      },
      material: {
        name: 'Material Design',
        description: 'Google Material Design elevation',
        shadows: [
          { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: '#000000', opacity: 0.12, inset: false },
          { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: '#000000', opacity: 0.24, inset: false }
        ]
      },
      hard: {
        name: 'Hard Shadow',
        description: 'Sharp, defined shadow',
        shadows: [
          { offsetX: 4, offsetY: 4, blurRadius: 0, spreadRadius: 0, color: '#000000', opacity: 0.25, inset: false }
        ]
      },
      inset: {
        name: 'Inset Shadow',
        description: 'Inner shadow effect',
        shadows: [
          { offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: '#000000', opacity: 0.25, inset: true }
        ]
      },
      colored: {
        name: 'Colored Shadow',
        description: 'Vibrant colored shadow',
        shadows: [
          { offsetX: 0, offsetY: 4, blurRadius: 12, spreadRadius: 0, color: '#3B82F6', opacity: 0.4, inset: false }
        ]
      },
      multi: {
        name: 'Multi-Layer',
        description: 'Complex layered shadows',
        shadows: [
          { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: '#000000', opacity: 0.12, inset: false },
          { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: '#000000', opacity: 0.24, inset: false },
          { offsetX: 0, offsetY: 4, blurRadius: 8, spreadRadius: 0, color: '#000000', opacity: 0.12, inset: false }
        ]
      }
    };
  }

  private loadPreset(presetName: string): void {
    const presets = this.getPresets();
    const preset = presets[presetName];
    
    if (preset) {
      this.shadows = [];
      this.shadowCounter = 0;
      
      preset.shadows.forEach(shadowConfig => {
        this.addShadowFromConfig(shadowConfig);
      });
    }
  }

  private resetToDefault(): void {
    this.shadows = [];
    this.shadowCounter = 0;
    this.addDefaultShadow();
  }

  protected loadSample(): void {
    this.elements.htmlInput.value = this.getSampleInput();
    this.handleInput();
  }
}