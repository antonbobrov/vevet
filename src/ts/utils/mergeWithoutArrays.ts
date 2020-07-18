import mergeWith from 'lodash.mergewith';
import isarray from 'isarray';

function mergeWithoutArrays(obj: object, source: object): any {
    return mergeWith(obj, source, (objValue, srcValue) => {
        if (isarray(objValue)) {
            return srcValue;
        }
    });
}

export default mergeWithoutArrays;