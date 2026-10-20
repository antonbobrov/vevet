import { TSwipeAxis } from '../types';

/**
 * Rubber-band transform for drag past movement bounds.
 *
 * Maps overflow through {@link rubberDistance} so stretch past limits is
 * asymptotic. With `overscroll <= 0`, values outside bounds clamp hard.
 *
 * @internal
 */
export function applyRubber(
  axis: TSwipeAxis,
  rawMovement: number,
  bounds: { x?: number[]; y?: number[]; angle?: number[] } | null,
  overscroll: number,
) {
  const axisBounds = bounds?.[axis];

  if (!axisBounds) {
    return rawMovement;
  }

  const [min, max] = axisBounds;

  if (rawMovement >= min && rawMovement <= max) {
    return rawMovement;
  }

  if (rawMovement < min) {
    return min - rubberDistance(min - rawMovement, overscroll);
  }

  return max + rubberDistance(rawMovement - max, overscroll);
}

/** Overscroll → rubber displacement. */
export function rubberDistance(overscroll: number, limit: number) {
  if (overscroll <= 0 || limit <= 0) {
    return 0;
  }

  return (limit * overscroll) / (limit + overscroll);
}
