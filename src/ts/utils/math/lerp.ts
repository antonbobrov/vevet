/**
 * Linear interpolation
 *
 * @param current
 * @param target
 * @param ease
 */
function lerp (
    current: number,
    target: number,
    ease: number,
) {

    const res = current * (1 - ease) + target * ease;

    const diff = Math.abs(target - res);
    if (diff <= 0.001) {
        return target;
    }

    return res;

}

export default lerp;
