import mergeWith from "lodash.mergewith";
import isarray from "isarray";

/**
 * Deep merge of two object except for arrays
 */
export default function mergeWithoutArrays (
    obj: Record<string, any>,
    source: Record<string, any>,
): any {
    return mergeWith(obj, source, (objValue, srcValue) => {
        if (isarray(objValue)) {
            return srcValue as Record<string, any>;
        }
        return {};
    });
}
