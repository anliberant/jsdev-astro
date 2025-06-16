export interface ButtonConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  borderWidth: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  borderRadius: number;
  fontSize: number;
  paddingX: number;
  paddingY: number;
  fontWeight: 'normal' | 'bold' | '400' | '500' | '600' | '700' | '800' | '900';
  fontFamily: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing: number;
  hoverEffect: 'none' | 'lift' | 'push' | 'glow' | 'shake';
  animationDuration: number;
}

export interface ButtonPreset {
  name: string;
  description: string;
  config: ButtonConfig;
}

export interface GeneratorElements {
  preview: HTMLElement;
  cssOutput: HTMLTextAreaElement;
  htmlOutput: HTMLTextAreaElement;
  // Text inputs
  textInput: HTMLInputElement;
  fontSizeInput: HTMLInputElement;
  fontWeightSelect: HTMLSelectElement;
  fontFamilyInput: HTMLInputElement;
  textTransformSelect: HTMLSelectElement;
  letterSpacingInput: HTMLInputElement;
  // Color inputs
  backgroundColorInput: HTMLInputElement;
  textColorInput: HTMLInputElement;
  borderColorInput: HTMLInputElement;
  shadowColorInput: HTMLInputElement;
  // Size inputs
  borderWidthInput: HTMLInputElement;
  shadowOffsetXInput: HTMLInputElement;
  shadowOffsetYInput: HTMLInputElement;
  borderRadiusInput: HTMLInputElement;
  paddingXInput: HTMLInputElement;
  paddingYInput: HTMLInputElement;
  // Animation inputs
  hoverEffectSelect: HTMLSelectElement;
  animationDurationInput: HTMLInputElement;
  // Range displays
  fontSizeValue: HTMLElement;
  borderWidthValue: HTMLElement;
  shadowOffsetXValue: HTMLElement;
  shadowOffsetYValue: HTMLElement;
  borderRadiusValue: HTMLElement;
  paddingXValue: HTMLElement;
  paddingYValue: HTMLElement;
  letterSpacingValue: HTMLElement;
  animationDurationValue: HTMLElement;
}

export interface TabElements {
  previewTab: HTMLButtonElement;
  cssTab: HTMLButtonElement;
  htmlTab: HTMLButtonElement;
  previewPanel: HTMLElement;
  cssPanel: HTMLElement;
  htmlPanel: HTMLElement;
}