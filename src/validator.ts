import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export function validateSchema<T>(schema: object, data: T): { valid: boolean; errors?: any } {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    return valid ? { valid } : { valid, errors: validate.errors };
}
