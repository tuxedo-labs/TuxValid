export interface ValidationError {
  message: string;
  path: string;
  params: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface Schema {
  type: string;
  properties: { [key: string]: any };
  required?: string[];
  enum?: string[];
  pattern?: string;
  additionalProperties?: boolean;
  customValidation?: Array<{ validate: Function; field: string }>;
}

export interface CustomValidationRule {
  validate: (data: any) => { valid: boolean; message: string };
  field: string;
}

