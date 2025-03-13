/**
 * A utility function to add an event listener to a specified element.
 *
 * This function adds an event listener for the specified event type and
 * returns a function that can be called to remove the event listener.
 *
 * @param element - The target element to which the event listener will be attached.
 * @param target - The name of the event to listen for (e.g., 'click', 'scroll').
 * @param listener - The callback function to execute when the event occurs.
 * @param options - Optional parameters for the event listener.
 *
 * @group Utils
 *
 * @example
 * const button = document.getElementById('myButton');
 * const removeClickListener = addEventListener(button, 'click', (event) => {
 *   console.log('Button clicked!');
 * });
 *
 * // To remove the event listener later
 * removeClickListener();
 */
export function addEventListener<
  Target extends keyof HTMLElementEventMap,
  Listener extends (event: DocumentEventMap[Target]) => void,
>(
  element: Document | Element | Window,
  target: Target,
  listener: Listener,
  options?: boolean | AddEventListenerOptions,
) {
  element.addEventListener(target, listener as any, options);

  const remove = () => {
    element.removeEventListener(target, listener as any, options);
  };

  return remove;
}
