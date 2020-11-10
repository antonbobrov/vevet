/**
 * Check if a number lies between two others
 */
export default function inScope (
    val: number,
    scope: number[] = [0, 1],
) {
    if (val >= scope[0] && val <= scope[1]) {
        return true;
    }
    return false;
}
