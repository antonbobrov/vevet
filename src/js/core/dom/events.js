/**
 * @typedef {object} Vevet.utils.BindListener
 * @property {string} id Id of the event.
 * @property {Window|HTMLElement} el Element with the event.
 * @property {string} target Target of the event.
 * @property {Function} do Callback of the event.
 */

/**
 * @typedef {object} Vevet.utils.Listener
 * @param {Window|HTMLElement} data.el - Element for the event.
 * @param {string} data.target - Target of the event.
 * @param {boolean} [data.passive] - Passive listener.
 * @param {Function} data.do - Callback.
 */

/**
 * @description Add event listener to the element. Almostqual to addEventListener but gives possibilities to manage listeners more convenient.
 * 
 * @param {Vevet.utils.Listener} data
 * 
 * @returns {Vevet.utils.BindListener} Returns id of the event, its element and callback.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.bindEventListener
 * 
 * @example 
 * 
 * Vevet.utils.bindEventListener({
 *     el: el,
 *     target: 'click',
 *     do: () => { 
 *         alert("Clicked!");
 *     }
 * });
 */
export function bindEventListener (data) {

    let attr = 'vevet-event',
        {el, target, do: callback} = data;

    if (typeof el[attr] == 'undefined') {
        el[attr] = {};
    }

    let id = this.id(`${attr}__${target}__`);

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


/**
 * @description Get event listener data of an element.
 * 
 * @param {object} data - Object with data of the event.
 * @param {Window|HTMLElement} data.el - Element with the event.
 * @param {string} data.id - Id of the event.
 * 
 * @returns {boolean|Vevet.utils.BindListener} Returns either 'false' or object with id of the event, its element and callback.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.getEventListener
 * 
 * @example 
 * 
 * Vevet.utils.getEventListener({
 *     el: el,
 *     id: 'id'
 * });
 */
export function getEventListener (data) {

    let attr = 'vevet-event',
        {el, id} = data;

    if (typeof el[attr] == 'undefined') {
        return false;
    }

    if (typeof el[attr][id] == 'undefined') {
        return false;
    }

    return {
        id: id,
        el: el,
        target: el[attr][id].target,
        do: el[attr][id].do
    };
    
}


/**
 * @description Remove event listener from an element.
 * 
 * @param {object} data - Object with data of the event.
 * @param {Window|HTMLElement} data.el - Element with the event.
 * @param {string} data.id - Id of the event.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.unbindEventListener
 * 
 * @example 
 * 
 * Vevet.utils.unbindEventListener({
 *     el: el,
 *     id: 'id'
 * });
 */
export function unbindEventListener (data) {

    let attr = 'vevet-event',
        event = this.getEventListener(data);

    event.el.removeEventListener(event.target, event.do, false);
    delete event.el[attr][data.id];
    
}