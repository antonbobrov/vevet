/**
 * Distribute scope progress among a certain quantity of timelines.
 */
export default function spreadScopeProgress (
    quantity: number,
    shift: number,
) {
    const timelines: [number, number][] = [];
    // duration for each element
    const duration = 1 / (quantity - shift * (quantity - 1));
    // calculate timelines
    for (let index = 0; index < quantity; index += 1) {
        const start = (duration * (1 - shift)) * index;
        const end = start + duration;
        timelines.push([start, end]);
    }
    return timelines;
}
