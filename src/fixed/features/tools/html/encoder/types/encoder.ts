export interface EncoderOptions {
  prettyFormat: boolean;
  specialChars: boolean;
  numericEntities: boolean;
}

export interface EncoderResult {
  success: boolean;
  output?: string;
  error?: string;
}