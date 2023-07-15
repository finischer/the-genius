export function copyNestedArray(array: any[]) {
  return JSON.parse(JSON.stringify(array));
}
