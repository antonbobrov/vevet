/**
 * Generate an ID
 */
export default function generateID (prefix = "id") {
    const id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;
    return `${prefix}_${id}`;
}
