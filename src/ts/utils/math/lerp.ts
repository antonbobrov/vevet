/**
 * Linear interpolation
 */
export default function lerp (
    current: number,
    target: number,
    ease: number,
    approximation = 0.001,
) {

    const res = current * (1 - ease) + target * ease;

    const diff = Math.abs(target - res);
    if (diff <= approximation) {
        return target;
    }

    return res;

}
