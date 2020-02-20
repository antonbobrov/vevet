import generateId from "./generateId";

/**
 * @typedef {object} Vevet.Listener
 * @param {Window|HTMLElement} data.el - The element for the event.
 * @param {string} data.target - The target of the event.
 * @param {boolean} [data.passive] - Is a passive listener.
 * @param {Function} data.do - Callback.
 */

/**
 * @typedef {object} Vevet.BindListener
 * @property {string} id Id of the event.
 * @property {Window|HTMLElement} el Element with the event.
 * @property {string} target Target of the event.
 * @property {Function} do Callback of the event.
 */

/**
 * @description Add event listener to the element.
 * Almost equal to addEventListener but gives possibilities to manage listeners more convenient.
 * 
 * @param {Vevet.Listener} data
 * 
 * @returns {Vevet.BindListener} Returns id of the event, its element and callback.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.addEventListener({
 *     el: el,
 *     target: 'click',
 *     do: () => { 
 *         alert("Clicked!");
 *     }
 * });
 */
function eventListenerAdd (data) {

    let attr = 'vevet-event',
        {el, target, do: callback} = data;

    if (typeof el[attr] == 'undefined') {
        el[attr] = {};
    }

    let id = generateId(`${attr}__${target}__`);

    if (data.passive) {
        el.addEventListener(target, callback, {
            passive: true
        });
    }
    else {
        el.addEventListener(target, callback, false);
    }

    el[attr][id] = {
        target: target,
        do: callback
    };

    return {
        id: id,
        el: el,
        target: target,
        do: callback
    };
    
}

export default eventListenerAdd;