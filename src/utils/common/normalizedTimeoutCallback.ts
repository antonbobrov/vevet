/**
 * Launches a function after a specified delay. If the `delay` is zero,
 * the callback is executed immediately (synchronously).
 *
 * @param callback - The function to be executed after the delay.
 * @param delay - The amount of time (in milliseconds) to wait before executing the callback.
 * If the delay is `0`, the callback will be executed synchronously.
 *
 * @returns {Object} An object with a `clear` method that can be used to cancel the timeout.
 *
 * @example
 * // Executes the callback after 1 second (1000 milliseconds).
 * normalizedTimeoutCallback(() => {
 *   console.log('Executed after 1 second');
 * }, 1000);
 *
 * // Executes the callback immediately.
 * normalizedTimeoutCallback(() => {
 *   console.log('Executed synchronously');
 * }, 0);
 */
export function normalizedTimeoutCallback(callback: Function, delay: number) {
  let timeout: NodeJS.Timeout | undefined;

  if (delay === 0) {
    callback();
  } else {
    timeout = setTimeout(() => callback(), delay);
  }

  return {
    /**
     * Clears the timeout if it was set.
     */
    clear: () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
  };
}
