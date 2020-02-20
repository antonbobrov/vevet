/**
 * @description Remove an event listener from an element.
 * 
 * @param {object} data - Data object of the event.
 * @param {Window|HTMLElement} data.el - Element with the event.
 * @param {string} data.id - Id of the event.
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.eventListenerRemove({
 *     el: el,
 *     id: 'id'
 * });
 */
function eventListenerRemove (data) {

    let attr = 'vevet-event',
        event = this.getEventListener(data);

    event.el.removeEventListener(event.target, event.do, false);
    delete event.el[attr][data.id];
    
}

export default eventListenerRemove;