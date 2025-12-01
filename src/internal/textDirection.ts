export function getTextDirection(element: Element) {
  return window.getComputedStyle(element).direction;
}
