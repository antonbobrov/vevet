/**
 * Transform image sizes to src set
 */
export default function imageSizesToSrcSet (
    sizes: Record<string | number, string>,
) {
    const keys = Object.keys(sizes);
    const srcParts = keys.map((key) => {
        const value = sizes[key];
        return `${value} ${key}w`;
    });
    return srcParts.join(', ');
}
