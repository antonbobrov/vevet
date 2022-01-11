/**
 * Check if the value is within the scope
 */
export default function inScope (
    val: number,
    scopeValue = [0, 1],
) {
    return val >= scopeValue[0] && val <= scopeValue[1];
}
