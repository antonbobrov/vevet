import scoped from './scoped';
import clamp from './clamp';

/**
 * Get progress relatively to the scope and clamp it within two points
 */
export default function clampScoped (
    val: number,
    scope = [0, 1],
    clampScope = [0, 1],
) {
    return clamp(
        scoped(val, scope),
        clampScope,
    );
}
