/**
 * Bound a number between two values.
 *
 * @param progress - Current time
 * @param scope
 *
 * @example
 *
 * boundProgress(-.35, [0, 1]);
 * // => 0
 *
 * boundProgress(.5, [.25, 1]);
 * // => .5
 *
 * boundProgress(1.5, [.25, 1]);
 * // => 1
 */
function boundProgress (
    progress: number,
    scope: number[] = [0, 1],
) {
    if (progress < scope[0]) {
        return scope[0];
    }
    if (progress > scope[1]) {
        return scope[1];
    }
    return progress;
}

export default boundProgress;
