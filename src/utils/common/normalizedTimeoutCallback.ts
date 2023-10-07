/**
 * Launch a function in a certain amount of time
 * If the `delay` argument is zero, the callback will be launched synchronously
 *
 * @example
 *
 * normalizedTimeoutCallback(callback, 1000);
 * normalizedTimeoutCallback(callback, 0); // synchronous, without delay
 */
export function normalizedTimeoutCallback(callback: Function, delay: number) {
  let timeout: NodeJS.Timeout | undefined;

  if (delay === 0) {
    callback();
  } else {
    timeout = setTimeout(() => callback(), delay);
  }

  return {
    clear: () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
  };
}
