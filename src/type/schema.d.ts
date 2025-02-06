export interface JSONSchema {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
}
