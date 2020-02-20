/**
 * @description Insert an element after another one.
 * 
 * @param {HTMLElement} el - The element to be inserted.
 * @param {HTMLElement} elRef - The reference element.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.domInsertAfter(el, elRef);
 */

function domInsertAfter (el, elRef) {
    
    let parent = elRef.parentNode,
        next = elRef.nextSibling;

    if (next) {
        parent.insertBefore(el, next);
    }
    else {
        parent.appendChild(el);
    }

}

export default domInsertAfter;