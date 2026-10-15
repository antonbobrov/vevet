import { isNumber } from './isNumber';

export function isFiniteNumber(value: any): value is number {
  return isNumber(value) && !Number.isNaN(value) && Number.isFinite(value);
}
