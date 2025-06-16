export interface BoxShadowConfig {
  id: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  inset: boolean;
  opacity: number;
}

export interface BoxShadowPreset {
  name: string;
  description: string;
  shadows: Omit<BoxShadowConfig, 'id'>[];
}

export interface GeneratorElements {
  preview: HTMLElement;
  cssOutput: HTMLTextAreaElement;
  htmlOutput: HTMLTextAreaElement;
  shadowsList: HTMLElement;
  addShadowBtn: HTMLButtonElement;
  // Shadow controls
  offsetXInput: HTMLInputElement;
  offsetYInput: HTMLInputElement;
  blurRadiusInput: HTMLInputElement;
  spreadRadiusInput: HTMLInputElement;
  colorInput: HTMLInputElement;
  opacityInput: HTMLInputElement;
  insetCheckbox: HTMLInputElement;
  // Range displays
  offsetXValue: HTMLElement;
  offsetYValue: HTMLElement;
  blurRadiusValue: HTMLElement;
  spreadRadiusValue: HTMLElement;
  opacityValue: HTMLElement;
  // Preview customization
  previewWidthInput: HTMLInputElement;
  previewHeightInput: HTMLInputElement;
  previewBgColorInput: HTMLInputElement;
  previewShapeSelect: HTMLSelectElement;
}

export interface TabElements {
  previewTab: HTMLButtonElement;
  cssTab: HTMLButtonElement;
  htmlTab: HTMLButtonElement;
  previewPanel: HTMLElement;
  cssPanel: HTMLElement;
  htmlPanel: HTMLElement;
}

export interface PreviewConfig {
  width: number;
  height: number;
  backgroundColor: string;
  shape: 'rectangle' | 'circle' | 'rounded';
}