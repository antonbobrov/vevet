import { isFiniteNumber } from './isFiniteNumber';

export function onlyFinite(value: number, defaultValue = 0) {
  if (isFiniteNumber(value)) {
    return value;
  }

  return defaultValue;
}
