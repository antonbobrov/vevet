/**
 * @description Remove all elements of a parent.
 * 
 * @param {HTMLElement} parent - The parent element.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.domRemoveChildren(el, parent);
 */

function domRemoveChildren (parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

}

export default domRemoveChildren;