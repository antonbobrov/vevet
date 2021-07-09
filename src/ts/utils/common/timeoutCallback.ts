/**
 * Launch a function in a certain amount of time
 * If the timeout argument is zero, the callback will be launched synchronously
 */
export default function timeoutCallback (
    callback: Function,
    timeout: number,
) {
    if (timeout === 0) {
        callback();
    } else {
        setTimeout(() => {
            callback();
        }, timeout);
    }
}
