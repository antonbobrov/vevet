let index = 0;

/**
 * Generate an ID
 */
export default function id (
    prefix = 'id',
) {
    index += 1;
    return `${prefix}_${index}`;
}
