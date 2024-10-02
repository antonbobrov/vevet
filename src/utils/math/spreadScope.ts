/**
 * Distribute the progress scope evenly across a specified number of timelines,
 * with an optional overlap or shift between them.
 *
 * The function divides the range `[0, 1]` into segments, where each segment represents
 * the progress of a timeline. The `shift` parameter allows overlap or space between
 * the timelines. A `shift` of 0 means no overlap, while positive values introduce
 * overlap between timelines.
 *
 * @param quantity - The number of timelines to distribute the progress scope over.
 * @param shift - A value from `0` to `1` that determines how much overlap exists between timelines. A `shift` of 0 means no overlap, while a shift closer to `1` results in more overlap. Negative values could introduce gaps between the timelines.
 *
 * @example
 *
 * spreadScope(3, 0.1);
 * // => [[0, 0.357], [0.321, 0.678], [0.642, 1]]
 * // Progress of 3 timelines with 0.1 shift (slight overlap)
 *
 * spreadScope(3, 0.9);
 * // => [[0, 0.833], [0.083, 0.916], [0.167, 1]]
 * // Progress of 3 timelines with 0.9 shift (more overlap)
 */
export function spreadScope(quantity: number, shift: number) {
  const timelines: number[][] = [];

  // duration for each element
  const duration = 1 / (quantity - shift * (quantity - 1));

  // calculate timelines
  for (let index = 0; index < quantity; index += 1) {
    const start = duration * (1 - shift) * index;
    const end = start + duration;
    timelines.push([start, end]);
  }

  return timelines;
}
