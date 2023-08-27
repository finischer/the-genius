export function copyNestedArray(array: unknown[]) {
  return JSON.parse(JSON.stringify(array)) as unknown[];
}

export function shuffleArray<T>(array: T[]) {
  const arrayForSort = [...array];
  return arrayForSort.sort(() => Math.random() - 0.5);
}
