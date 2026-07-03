import { TSwipeAxis } from '../types';

/**
 * Rubber-band overscroll past movement bounds.
 *
 * Maps overscroll distance through `rubberDistance` so drag past limits
 * feels asymptotic rather than hard-clamped.
 *
 * @internal
 */
export function applyRubber(
  axis: TSwipeAxis,
  rawMovement: number,
  bounds: { x?: number[]; y?: number[]; angle?: number[] } | null,
  overflow: number,
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
    return min - rubberDistance(min - rawMovement, overflow);
  }

  return max + rubberDistance(rawMovement - max, overflow);
}

/** Overscroll → rubber displacement. */
export function rubberDistance(overscroll: number, limit: number) {
  if (overscroll <= 0 || limit <= 0) {
    return 0;
  }

  return (limit * overscroll) / (limit + overscroll);
}
