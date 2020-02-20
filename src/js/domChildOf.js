/**
 * @description Check if element is a child of another element.
 * 
 * @param {HTMLElement} el - The lement to be checked.
 * @param {HTMLElement} parent - A potential parent of the element.
 * 
 * @returns {boolean} Returns true if the element is a child of another one.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.domChildOf(el, parent);
 * // => true|false
 */
function domChildOf (el, parent) {

    function childOfCheck (el, parent) {
    
        let contains = false;
    
        if (el === parent) {
            contains = true;
        }
    
        if (contains !== true) {
            if (el !== null) {
                return childOfCheck(el.parentNode, parent);
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    
    }

    return childOfCheck(el, parent);

}

export default domChildOf;