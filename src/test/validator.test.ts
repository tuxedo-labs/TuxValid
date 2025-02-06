import { validateSchema } from "../validator";
import test from "node:test";
import assert from "node:assert/strict";

test("Valid data should pass", () => {
    const schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            age: { type: "number" }
        },
        required: ["name", "age"],
        additionalProperties: false
    };

    const data = { name: "John", age: 30 };
    const result = validateSchema(schema, data);

    assert.strictEqual(result.valid, true);
});

test("Invalid data should fail", () => {
    const schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            age: { type: "number" }
        },
        required: ["name", "age"],
        additionalProperties: false
    };

    const data = { name: "John" }; // Missing 'age'
    const result = validateSchema(schema, data);

    assert.strictEqual(result.valid, false);
});

