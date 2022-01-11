/**
 * Clamp the value between two points
 */
export default function clamp (
    val: number,
    scope = [0, 1],
) {
    if (val < scope[0]) {
        return scope[0];
    }
    if (val > scope[1]) {
        return scope[1];
    }
    return val;
}
