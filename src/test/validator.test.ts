import { Validator } from "../validator";

describe('Validator Tests', () => {

  it('should pass for valid data', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string', pattern: '^\\S+@\\S+\\.\\S+$' },
        role: { type: 'string', enum: ['admin', 'user', 'moderator'] },
      },
      required: ['name', 'age', 'email', 'role'],
    };

    const data = {
      name: 'John',
      age: 30,
      email: 'john.doe@example.com',
      role: 'admin',
    };

    const validator = new Validator(schema);
    const result = validator.validate(data);

    expect(result.valid).toBe(true);
  });

  it('should fail if required fields are missing', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string', pattern: '^\\S+@\\S+\\.\\S+$' },
        role: { type: 'string', enum: ['admin', 'user', 'moderator'] },
      },
      required: ['name', 'age', 'email', 'role'],
    };

    const data = {
      name: 'John',
      email: 'john.doe@example.com',
    };

    const validator = new Validator(schema);
    const result = validator.validate(data);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(5);

    const errorMessages = result.errors.map((error: any) => error.message);
    expect(errorMessages).toContain('Field is required');
    expect(errorMessages).toContain('Expected type number for age');
    expect(errorMessages).toContain('Expected type string for role');
    expect(errorMessages).toContain('Field role must be one of the following: admin, user, moderator');
  });

  it('should fail if email pattern is incorrect', () => {
    const schema = {
      type: 'object',
      properties: {
        email: { type: 'string', pattern: '^\\S+@\\S+\\.\\S+$' },
      },
      required: ['email'],
    };

    const data = {
      email: 'invalid-email',
    };

    const validator = new Validator(schema);
    const result = validator.validate(data);

    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('does not match the required pattern');
  });

  it('should fail if role is not in the allowed enum values', () => {
    const schema = {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['admin', 'user', 'moderator'] },
      },
      required: ['role'],
    };

    const data = {
      role: 'guest', 
    };

    const validator = new Validator(schema);
    const result = validator.validate(data);

    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('must be one of the following: admin, user, moderator'); 
  });
});

