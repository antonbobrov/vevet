/**
 * Distribute scope progress among a certain quantity of timelines.
 *
 * @example
 *
 * spreadScope(3, 0.1); // => [[0,0.35714285714285715],[0.32142857142857145,0.6785714285714286],[0.6428571428571429,1]]
 * spreadScope(3, 0.9); // => [[0,0.8333333333333334],[0.08333333333333331,0.9166666666666667],[0.16666666666666663,1]]
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
