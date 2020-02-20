/**
 * @description Timeout callback.
 * 
 * @param {Function} callback
 * @param {number} timeout
 * 
 * @memberof Vevet
 * 
 */
function timeoutCallback(callback, timeout) {

    if (timeout === 0) {
        callback();
    }
    else {
        setTimeout(callback.bind(this), timeout);
    }

}

export default timeoutCallback;