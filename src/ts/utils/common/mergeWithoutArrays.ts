import mergeWith from 'lodash.mergewith';
import isarray from 'isarray';

/**
 * Deep merge of two object except for arrays
 */
export default function mergeWithoutArrays <
    A extends Record<string, any>,
    B extends Record<string, any>,
> (
    obj: A,
    source: B,
): A & B {
    return mergeWith(obj, source, (objValue, srcValue) => {
        if (isarray(objValue)) {
            return srcValue as Record<string, any>;
        }
        return {};
    });
}
