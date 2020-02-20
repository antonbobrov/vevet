/**
 * @description Get child elements that match a certain selector.
 * 
 * @param {string} selector - A string selector.
 * @param {HTMLElement} outer - A parent element.
 * @param {number} [level=1] - What level of nesting.
 * 
 * @returns {Array<HTMLElement>} - Returns all children that match the selector.
 * 
 * @memberof Vevet
 */
function domChildren(selector, outer = false, level = 1) {

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
            elements = elements.concat(domChildren(selector, els[i], level - 1));
        }
    }

    return elements;

}

export default domChildren;