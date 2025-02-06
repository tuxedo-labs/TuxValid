export function handleError(message: string, field: string, params: any): any {
  return {
    message,
    field,
    path: field,
    params,
  };
};
