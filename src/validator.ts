import { ValidationResult } from "./type/schema";
import { handleError } from "./utils/errorHandler";

export class Validator {
  private schema: any;

  constructor(schema: any) {
    this.schema = schema;
  }

  validate(data: any): ValidationResult {
    const errors: any[] = [];

    this.checkRequiredFields(data, errors);
    this.checkType(data, errors);
    this.checkPattern(data, errors);
    this.checkEnum(data, errors);
    this.checkNestedObjects(data, errors);
    this.checkArrayItems(data, errors);
    this.checkAdditionalProperties(data, errors);
    this.checkCustomValidation(data, errors);

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  private checkRequiredFields(data: any, errors: any[]) {
    if (this.schema.required) {
      for (const field of this.schema.required) {
        if (!(field in data)) {
          const message = this.getCustomMessage(field, "required");
          errors.push(handleError(message || "Field is required", field, {}));
        }
      }
    }
  }

  private checkType(data: any, errors: any[]) {
    if (this.schema.properties) {
      for (const field in this.schema.properties) {
        const type = this.schema.properties[field].type;
        if (type && typeof data[field] !== type) {
          const message = this.getCustomMessage(field, "type");
          errors.push(
            handleError(
              message || `Expected type ${type} for ${field}`,
              field,
              {
                expected: type,
                received: typeof data[field],
              },
            ),
          );
        }
      }
    }
  }

  private checkPattern(data: any, errors: any[]) {
    if (this.schema.properties) {
      for (const field in this.schema.properties) {
        const pattern = this.schema.properties[field].pattern;
        if (pattern && !new RegExp(pattern).test(data[field])) {
          const message = this.getCustomMessage(field, "pattern");
          errors.push(
            handleError(
              message || `Field ${field} does not match the required pattern`,
              field,
              { pattern },
            ),
          );
        }
      }
    }
  }

  private checkEnum(data: any, errors: any[]) {
    if (this.schema.properties) {
      for (const field in this.schema.properties) {
        const enumValues = this.schema.properties[field].enum;
        if (enumValues && !enumValues.includes(data[field])) {
          const message = this.getCustomMessage(field, "enum");
          errors.push(
            handleError(
              message || `Field ${field} must be one of the following: ${enumValues.join(", ")}`,
              field,
              {
                allowed: enumValues,
              },
            ),
          );
        }
      }
    }
  }

  private checkNestedObjects(data: any, errors: any[]) {
    if (this.schema.properties) {
      for (const field in this.schema.properties) {
        const nestedSchema = this.schema.properties[field];
        if (nestedSchema.type === "object" && data[field]) {
          const nestedValidator = new Validator(nestedSchema);
          const result = nestedValidator.validate(data[field]);
          if (!result.valid) {
            errors.push(
              ...result.errors.map((error: any) => ({
                ...error,
                path: `${field}.${error.path}`,
              }))
            );
          }
        }
      }
    }
  }

  private checkArrayItems(data: any, errors: any[]) {
    if (this.schema.properties) {
      for (const field in this.schema.properties) {
        const arraySchema = this.schema.properties[field];
        if (arraySchema.type === "array" && Array.isArray(data[field])) {
          const itemSchema = arraySchema.items;
          if (itemSchema) {
            data[field].forEach((item: any, index: number) => {
              const itemValidator = new Validator(itemSchema);
              const result = itemValidator.validate(item);
              if (!result.valid) {
                errors.push(
                  ...result.errors.map((error: any) => ({
                    ...error,
                    path: `${field}[${index}]${error.path}`,
                  }))
                );
              }
            });
          }
        }
      }
    }
  }

  private checkAdditionalProperties(data: any, errors: any[]) {
    if (this.schema.additionalProperties === false) {
      if (this.schema.properties) {
        const allowedProperties = Object.keys(this.schema.properties);
        Object.keys(data).forEach((key) => {
          if (!allowedProperties.includes(key)) {
            const message = this.getCustomMessage(key, "additionalProperties");
            errors.push(handleError(message || `Additional property not allowed: ${key}`, key, {}));
          }
        });
      }
    }
  }

  private checkCustomValidation(data: any, errors: any[]) {
    if (this.schema.customValidation) {
      this.schema.customValidation.forEach((customRule: any) => {
        const result = customRule.validate(data);
        if (!result.valid) {
          errors.push(handleError(result.message, customRule.field, {}));
        }
      });
    }
  }

  private getCustomMessage(field: string, validationType: string): string | undefined {
    if (this.schema.properties && this.schema.properties[field]) {
      const customMessages = this.schema.properties[field].messages || {};
      return customMessages[validationType];
    }
    return undefined;
  }
}

