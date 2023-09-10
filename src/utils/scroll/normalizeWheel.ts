import normalizeWheelFunc from 'normalize-wheel';

export function normalizeWheel(event: WheelEvent) {
  return normalizeWheelFunc(event);
}
