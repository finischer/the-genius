export function copyNestedArray(array: unknown[]) {
  return JSON.parse(JSON.stringify(array)) as unknown[];
}

export function shuffleArray<T>(a: T[]) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j] as T;
    a[j] = x as T;
  }
  return a;
}
