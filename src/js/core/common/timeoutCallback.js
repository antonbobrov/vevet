/**
 * @description Timeout callback.
 * 
 * @param {Function} callback
 * @param {number} timeout
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.timeoutCallback
 * 
 * @public
 */
export function timeoutCallback(callback, timeout) {

    if (timeout === 0) {
        callback();
    }
    else {
        setTimeout(callback.bind(this), timeout);
    }

}