import PCancelable from 'p-cancelable';

export { PCancelable };

/**
 * This module imports and re-exports the `PCancelable` class from the `@anton.bobrov/p-cancelable` package.
 *
 * `PCancelable` provides a way to create promises that can be canceled. It is useful in scenarios where
 * you want to cancel an ongoing asynchronous operation before it finishes.
 *
 * @example
 * const p = new PCancelable((resolve, reject, onCancel) => {
 *   const timeout = setTimeout(resolve, 1000);
 *   onCancel(() => clearTimeout(timeout));
 * });
 *
 * p.cancel(); // Cancels the operation
 *
 * @see {@link https://github.com/antonbobrov/p-cancelable}
 */
