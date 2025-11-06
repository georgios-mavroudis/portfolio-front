export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(x: number, min: number, max: number) {
  return x < min ? min : x > max ? max : x;
}

export function roundToSpecificDecimals(x: number, numberOfdecimals: number) {
  return Math.round(x * numberOfdecimals * 10) / (numberOfdecimals * 10);
}
