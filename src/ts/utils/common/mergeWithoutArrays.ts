import mergeWith from 'lodash.mergewith';
import cloneDeep from 'lodash.clonedeep';

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
    const obj = cloneDeep(object);
    const src = cloneDeep(source);
    return mergeWith(obj, src, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
            return srcValue as Record<string, any>;
        }
        return undefined;
    });
}
