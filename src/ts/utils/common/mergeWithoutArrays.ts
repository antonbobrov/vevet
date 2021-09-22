import mergeWith from 'lodash.mergewith';

/**
 * Deep merge of two objects except for arrays.
 * The function doesn't change the "object" and "source".
 */
export default function mergeWithoutArrays <
    A extends Record<string, any>,
    B extends Record<string, any>,
> (
    object: A,
    source: B,
): A & B {
    return mergeWith(object, source, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
            return srcValue as Record<string, any>;
        }
        return undefined;
    });
}