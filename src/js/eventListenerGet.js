/**
 * @description Get event listener data of an element.
 * 
 * @param {object} data - The data object of the event.
 * @param {Window|HTMLElement} data.el - Element with the event.
 * @param {string} data.id - Id of the event.
 * 
 * @returns {false|Vevet.BindListener} Returns either 'false' or object with an id of the event, 
 * its element and callback.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.eventListenerGet({
 *     el: el,
 *     id: 'id'
 * });
 */
function eventListenerGet (data) {

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

export default eventListenerGet;