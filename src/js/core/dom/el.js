/**
 * @description Check if element is a child of another element.
 * 
 * @param {HTMLElement} el - Element to be checked.
 * @param {HTMLElement} parent - Potential parent of the element.
 * 
 * @returns {boolean} Returns true if element is a child of another one.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.childOf
 * 
 * @example 
 * 
 * Vevet.utils.childOf(el, parent);
 * // => true|false
 */
export function childOf (el, parent) {

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



/**
 * @description Insert element after another element.
 * 
 * @param {HTMLElement} el - Element to be inserted.
 * @param {HTMLElement} elRef - Reference element.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.insertAfter
 * 
 * @example 
 * 
 * Vevet.utils.insertAfter(el, elRef);
 */

export function insertAfter (el, elRef) {
    
    let parent = elRef.parentNode,
        next = elRef.nextSibling;

    if (next) {
        parent.insertBefore(el, next);
    }
    else {
        parent.appendChild(el);
    }

}



/**
 * @description Remove all elements of a parent.
 * 
 * @param {HTMLElement} parent - Parent element.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.removeChildren
 * 
 * @example 
 * 
 * Vevet.utils.removeChildren(el, parent);
 */

export function removeChildren (parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

}



/**
 * @description Get an element.
 * 
 * @param {string|HTMLElement|Window} selector - Either a string selector or an element.
 * @param {HTMLElement|boolean} [outer] - An outer element. It will work only for string selectors.
 * 
 * @returns {HTMLElement} - Returns anelement.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.element
 */
export function element(selector, outer = false) {

    if (selector instanceof HTMLElement) {
        return selector;
    }
    else if (selector instanceof Window) {
        return selector;
    }
    else {
        if (outer instanceof HTMLElement) {
            return outer.querySelector(selector);
        }
        else {
            return document.querySelector(selector);
        }
    }

}



/**
 * @description Get elements.
 * 
 * @param {string|HTMLElement|NodeList|Array<HTMLElement>|Window} selector - A string selector, an element or a node list.
 * @param {HTMLElement|boolean} [outer] - An outer element. It will work only for string selectors.
 * 
 * @returns {NodeList} - Returns elements.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.element
 */
export function elements(selector, outer = false) {

    if (selector instanceof NodeList) {
        return selector;
    }
    else if (Array.isArray(selector)) {
        return selector;
    }
    else if (selector instanceof HTMLElement) {
        return [selector];
    }
    else if (selector instanceof Window) {
        return [selector];
    }
    else {
        if (outer instanceof HTMLElement) {
            return outer.querySelectorAll(selector);
        }
        else {
            return document.querySelectorAll(selector);
        }
    }

}



/**
 * @description Get child elements that match a certain selector.
 * 
 * @param {string} selector - A string selector.
 * @param {HTMLElement} outer - An outer element.
 * @param {number} [level=1] - What level of nesting.
 * 
 * @returns {Array<HTMLElement>} - Returns all children that match the selector.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.element
 */
export function children(selector, outer = false, level = 1) {

    let elements = [],
        els = outer.children;

    if (els.length === 0) {
        return [];
    }

    if (level <= 1) {
        for (let i = 0; i < els.length; i++) {
            let el = els[i];
            if (el.matches(selector)) {
                elements.push(el);
            }
        }
    }
    else {
        for (let i = 0; i < els.length; i++) {
            elements = elements.concat(children(selector, els[i], level - 1));
        }
    }

    return elements;

}