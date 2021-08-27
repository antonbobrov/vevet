/**
 * Linear interpolation
 */
export default function lerp (
    current: number,
    target: number,
    ease: number,
    approximationLeft = 0.001,
) {
    const val = current * (1 - ease) + target * ease;
    const diff = Math.abs(target - val);
    if (diff <= approximationLeft) {
        return target;
    }
    return val;
}
