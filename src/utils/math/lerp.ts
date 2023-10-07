/**
 * Linear interpolation
 *
 * @example
 *
 * lerp(0, 1, 0.4); // => 0.4
 * lerp(0.75, 0.8, 0.98); // => 0.799
 */
export function lerp(
  current: number,
  target: number,
  ease: number,
  approximationLeft = 0.001
) {
  const value = current * (1 - ease) + target * ease;
  const difference = Math.abs(target - value);

  if (difference <= approximationLeft) {
    return target;
  }

  return value;
}
