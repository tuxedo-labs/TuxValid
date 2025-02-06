# TuxValid

`TuxValid` is a lightweight JavaScript and TypeScript library for validating data against JSON Schema. It uses `Ajv` (Another JSON Schema Validator) to perform the validation, making it easy to ensure that your data complies with a specified structure.

## Installation

You can install `TuxValid` using npm or yarn:

### Using npm:
```bash
npm install @tuxedolabs/tuxvalid
```

Usage
After installation, you can use the Validator class to validate your data against a JSON Schema.

Example:
```typescript
Import the Validator class:
typescript
Copy
Edit
import { Validator } from '@tuxedolabs/tuxvalid';
Define your JSON Schema:
typescript
Copy
Edit
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
```
Create a Validator instance and validate data:
```typescript
const data = {
  name: 'John',
  age: 30,
  email: 'john.doe@example.com',
  role: 'admin',
};

const validator = new Validator(schema);
const result = validator.validate(data);

if (result.valid) {
  console.log('Data is valid!');
} else {
  console.error('Validation failed:', result.errors);
}
```
Example with Invalid Data:
```typescript
const invalidData = {
  name: 'John',
  email: 'john.doe@example.com',
};

const result = validator.validate(invalidData);

if (!result.valid) {
  console.error('Validation failed:', result.errors);
}
```
API `new Validator(schema: object)`
Creates a new instance of the Validator class. The schema parameter should be a valid JSON Schema.

`validate(data: object): ValidationResult`
Validates the data object against the provided schema. Returns a ValidationResult object with the validation status and any errors.

ValidationResult:
valid: A boolean indicating whether the data is valid.
errors: An array of error objects (if any validation errors occurred). Each error object contains details about the validation error.
License
MIT License. See the LICENSE file for more information.
