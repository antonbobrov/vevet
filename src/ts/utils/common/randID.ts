/**
 * Generate a random ID
 */
export default function randID (
    prefix = 'id',
) {
    const id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;
    return `${prefix}_${id}`;
}
