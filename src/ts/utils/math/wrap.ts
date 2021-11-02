/**
 * Wrap values
 */
export default function wrap (
    min: number,
    max: number,
    value: number,
) {
    const range = max - min;
    return conditionalReturn(value, (val) => ((range + ((val - min) % range)) % range) + min);
}

function conditionalReturn (
    value: number,
    func: (val: number) => number,
) {
    return value || value === 0 ? func(value) : func;
}
