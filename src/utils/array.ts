export function copyNestedArray(array: unknown[]) {
  return JSON.parse(JSON.stringify(array)) as unknown[];
}
