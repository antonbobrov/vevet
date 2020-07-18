function timeoutCallback(callback: Function, timeout: number) {

    if (timeout === 0) {
        callback();
    }
    else {
        setTimeout(callback.bind(this), timeout);
    }

}

export default timeoutCallback;