import { IframeGenerator } from './iframe-generator';
import type { IframeElements, IframeConfig } from '../types/iframe';

export class IframeGeneratorController {
  private generator: IframeGenerator;
  private elements: IframeElements;

  constructor() {
    this.generator = new IframeGenerator();
    this.initializeElements();
    this.bindEvents();
    this.setupPermissions();
    this.updatePreview();
  }

  private initializeElements(): void {
    this.elements = {
      // Input fields
      srcInput: this.safeGetElement<HTMLInputElement>('src-input') || document.createElement('input'),
      widthInput: this.safeGetElement<HTMLInputElement>('width-input') || document.createElement('input'),
      heightInput: this.safeGetElement<HTMLInputElement>('height-input') || document.createElement('input'),
      titleInput: this.safeGetElement<HTMLInputElement>('title-input') || document.createElement('input'),
      nameInput: this.safeGetElement<HTMLInputElement>('name-input') || document.createElement('input'),
      idInput: this.safeGetElement<HTMLInputElement>('id-input') || document.createElement('input'),
      classInput: this.safeGetElement<HTMLInputElement>('class-input') || document.createElement('input'),
      styleInput: this.safeGetElement<HTMLTextAreaElement>('style-input') || document.createElement('textarea'),
      
      // Select elements
      loadingSelect: this.safeGetElement<HTMLSelectElement>('loading-select') || document.createElement('select'),
      referrerPolicySelect: this.safeGetElement<HTMLSelectElement>('referrer-policy-select') || document.createElement('select'),
      frameBorderInput: this.safeGetElement<HTMLInputElement>('frame-border-input') || document.createElement('input'),
      scrollingSelect: this.safeGetElement<HTMLSelectElement>('scrolling-select') || document.createElement('select'),
      
      // Checkboxes
      allowFullscreenCheck: this.safeGetElement<HTMLInputElement>('allow-fullscreen') || document.createElement('input'),
      
      // Multi-select areas
      sandboxContainer: this.safeGetElement('sandbox-permissions') || document.createElement('div'),
      allowContainer: this.safeGetElement('allow-permissions') || document.createElement('div'),
      
      // Output elements
      preview: this.safeGetElement('iframe-preview') || document.createElement('div'),
      htmlOutput: this.safeGetElement<HTMLTextAreaElement>('html-output') || document.createElement('textarea'),
      
      // UI elements
      errorMessage: this.safeGetElement('error-message') || document.createElement('div'),
      successMessage: this.safeGetElement('success-message') || document.createElement('div'),
      outputStats: this.safeGetElement('output-stats') || document.createElement('div')
    };
  }

  private bindEvents(): void {
    // Input events
    this.safeAddEventListener(this.elements.srcInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.widthInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.heightInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.titleInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.nameInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.idInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.classInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.styleInput, 'input', () => this.updateFromInputs());

    // Select events
    this.safeAddEventListener(this.elements.loadingSelect, 'change', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.referrerPolicySelect, 'change', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.frameBorderInput, 'input', () => this.updateFromInputs());
    this.safeAddEventListener(this.elements.scrollingSelect, 'change', () => this.updateFromInputs());

    // Checkbox events
    this.safeAddEventListener(this.elements.allowFullscreenCheck, 'change', () => this.updateFromInputs());

    // Button events
    this.safeAddEventListener(this.safeGetElement('copy-html'), 'click', () => this.copyHTML());
    this.safeAddEventListener(this.safeGetElement('copy-responsive'), 'click', () => this.copyResponsiveHTML());
    this.safeAddEventListener(this.safeGetElement('clear-all'), 'click', () => this.clearAll());
    this.safeAddEventListener(this.safeGetElement('validate-url'), 'click', () => this.validateUrl());

    // Preset buttons
    const presets = IframeGenerator.getPresets();
    Object.keys(presets).forEach(presetKey => {
      this.safeAddEventListener(this.safeGetElement(`preset-${presetKey}`), 'click', () => {
        this.loadPreset(presetKey);
      });
    });
  }

  private setupPermissions(): void {
    this.setupSandboxPermissions();
    this.setupAllowPermissions();
  }

  private setupSandboxPermissions(): void {
    const permissions = IframeGenerator.getSandboxPermissions();
    const container = this.elements.sandboxContainer;
    
    container.innerHTML = '';
    
    permissions.forEach(permission => {
      const checkboxGroup = document.createElement('div');
      checkboxGroup.className = 'permission-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `sandbox-${permission.value}`;
      checkbox.value = permission.value;
      checkbox.addEventListener('change', () => this.updateFromInputs());
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = permission.label;
      
      const description = document.createElement('small');
      description.textContent = permission.description;
      description.className = 'permission-description';
      
      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
      checkboxGroup.appendChild(description);
      container.appendChild(checkboxGroup);
    });
  }

  private setupAllowPermissions(): void {
    const permissions = IframeGenerator.getAllowPermissions();
    const container = this.elements.allowContainer;
    
    container.innerHTML = '';
    
    permissions.forEach(permission => {
      const checkboxGroup = document.createElement('div');
      checkboxGroup.className = 'permission-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `allow-${permission.value}`;
      checkbox.value = permission.value;
      checkbox.addEventListener('change', () => this.updateFromInputs());
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = permission.label;
      
      const description = document.createElement('small');
      description.textContent = permission.description;
      description.className = 'permission-description';
      
      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
      checkboxGroup.appendChild(description);
      container.appendChild(checkboxGroup);
    });
  }

  private updateFromInputs(): void {
    const config: Partial<IframeConfig> = {
      src: this.elements.srcInput.value,
      width: this.elements.widthInput.value,
      height: this.elements.heightInput.value,
      title: this.elements.titleInput.value,
      name: this.elements.nameInput.value,
      id: this.elements.idInput.value,
      className: this.elements.classInput.value,
      style: this.elements.styleInput.value,
      loading: this.elements.loadingSelect.value as any,
      referrerPolicy: this.elements.referrerPolicySelect.value as any,
      frameBorder: this.elements.frameBorderInput.value,
      scrolling: this.elements.scrollingSelect.value as any,
      allowFullscreen: this.elements.allowFullscreenCheck.checked,
      sandbox: this.getSelectedPermissions('sandbox'),
      allow: this.getSelectedPermissions('allow')
    };

    this.generator.updateConfig(config);
    this.updatePreview();
    this.updateOutput();
  }

  private getSelectedPermissions(type: 'sandbox' | 'allow'): string[] {
    const container = type === 'sandbox' ? this.elements.sandboxContainer : this.elements.allowContainer;
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
  }

  private updatePreview(): void {
    try {
      const html = this.generator.generateHTML();
      this.elements.preview.innerHTML = html;
      this.hideError();
    } catch (error) {
      this.showError((error as Error).message);
      this.elements.preview.innerHTML = '<p class="error">Invalid configuration</p>';
    }
  }

  private updateOutput(): void {
    try {
      const html = this.generator.generateHTML();
      this.elements.htmlOutput.value = html;
      this.updateStats();
    } catch (error) {
      this.elements.htmlOutput.value = '';
      this.updateStats();
    }
  }

  private loadPreset(presetKey: string): void {
    const presets = IframeGenerator.getPresets();
    const preset = presets[presetKey];
    
    if (preset) {
      this.generator.updateConfig(preset.config);
      this.updateUIFromConfig();
      this.updatePreview();
      this.updateOutput();
      this.showSuccess(`Loaded preset: ${preset.name}`);
    }
  }

  private updateUIFromConfig(): void {
    const config = this.generator.getConfig();
    
    this.elements.srcInput.value = config.src;
    this.elements.widthInput.value = config.width;
    this.elements.heightInput.value = config.height;
    this.elements.titleInput.value = config.title;
    this.elements.nameInput.value = config.name;
    this.elements.idInput.value = config.id;
    this.elements.classInput.value = config.className;
    this.elements.styleInput.value = config.style;
    this.elements.loadingSelect.value = config.loading;
    this.elements.referrerPolicySelect.value = config.referrerPolicy;
    this.elements.frameBorderInput.value = config.frameBorder;
    this.elements.scrollingSelect.value = config.scrolling;
    this.elements.allowFullscreenCheck.checked = config.allowFullscreen;

    // Update sandbox permissions
    this.elements.sandboxContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      const checkbox = cb as HTMLInputElement;
      checkbox.checked = config.sandbox.includes(checkbox.value);
    });

    // Update allow permissions
    this.elements.allowContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      const checkbox = cb as HTMLInputElement;
      checkbox.checked = config.allow.includes(checkbox.value);
    });
  }

  private async copyHTML(): Promise<void> {
    try {
      const html = this.generator.generateHTML();
      await navigator.clipboard.writeText(html);
      this.showSuccess('HTML copied to clipboard!');
      this.temporaryButtonText('copy-html', '✅ Copied!', '📋 Copy HTML');
    } catch (error) {
      this.showError('Failed to copy HTML');
    }
  }

  private async copyResponsiveHTML(): Promise<void> {
    try {
      const html = this.generator.generateResponsiveWrapper();
      await navigator.clipboard.writeText(html);
      this.showSuccess('Responsive HTML copied to clipboard!');
      this.temporaryButtonText('copy-responsive', '✅ Copied!', '📱 Copy Responsive');
    } catch (error) {
      this.showError('Failed to copy responsive HTML');
    }
  }

  private clearAll(): void {
    this.generator = new IframeGenerator();
    this.updateUIFromConfig();
    this.updatePreview();
    this.updateOutput();
    this.showSuccess('All fields cleared');
  }

  private validateUrl(): void {
    const url = this.elements.srcInput.value;
    const validation = this.generator.validateUrl(url);
    
    if (validation.isValid) {
      this.showSuccess('URL is valid!');
    } else {
      this.showError(validation.error || 'Invalid URL');
    }
  }

  private updateStats(): void {
    const html = this.elements.htmlOutput.value;
    const stats = {
      characters: html.length,
      lines: html.split('\n').length,
      bytes: new Blob([html]).size
    };

    this.elements.outputStats.textContent = 
      `${stats.characters} chars, ${stats.lines} lines, ${stats.bytes} bytes`;
  }

  private showError(message: string): void {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
    this.elements.successMessage.classList.add('hidden');
  }

  private showSuccess(message: string): void {
    this.elements.successMessage.textContent = message;
    this.elements.successMessage.classList.remove('hidden');
    this.elements.errorMessage.classList.add('hidden');
    
    setTimeout(() => {
      this.elements.successMessage.classList.add('hidden');
    }, 3000);
  }

  private hideError(): void {
    this.elements.errorMessage.classList.add('hidden');
  }

  private temporaryButtonText(buttonId: string, tempText: string, originalText: string): void {
    const button = this.safeGetElement(buttonId);
    if (button) {
      button.textContent = tempText;
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  }

  private safeGetElement<T extends HTMLElement>(id: string): T | null {
    try {
      return document.getElementById(id) as T | null;
    } catch (error) {
      console.warn(`Element with id "${id}" not found:`, error);
      return null;
    }
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
}