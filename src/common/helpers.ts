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
  return Math.round(x * Math.pow(10, numberOfdecimals)) / Math.pow(10, numberOfdecimals);
}

export function inRange(x: number, min: number, max: number) {
  return min <= x && x <= max;
}
