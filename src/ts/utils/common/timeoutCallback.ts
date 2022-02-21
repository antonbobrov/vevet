/**
 * Launch a function in a certain amount of time
 * If the timeout argument is zero, the callback will be launched synchronously
 */
export default function timeoutCallback (
    callback: Function,
    delay: number,
) {
    let timeout: NodeJS.Timeout | undefined;
    if (delay === 0) {
        callback();
    } else {
        timeout = setTimeout(() => {
            callback();
        }, delay);
    }
    return {
        clear: () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        },
    };
}
