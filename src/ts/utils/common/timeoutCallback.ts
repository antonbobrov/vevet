/**
 * Launch a function in a certain amount of time
 */
export default function timeoutCallback (
    callback: Function,
    timeout: number,
) {
    if (timeout === 0) {
        callback();
    }
    else {
        setTimeout(callback.bind(this), timeout);
    }
}
