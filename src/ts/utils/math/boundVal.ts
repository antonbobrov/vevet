/**
 * Bound a value between two points
 */
export default function boundVal (
    val: number,
    scope: [number, number] = [0, 1],
) {
    if (val < scope[0]) {
        return scope[0];
    }
    if (val > scope[1]) {
        return scope[1];
    }
    return val;
}
