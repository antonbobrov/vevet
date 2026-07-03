export function getTextDirection(element: Element) {
  return window.getComputedStyle(element).direction;
}

export function isRtl(element: Element) {
  return getTextDirection(element) === 'rtl';
}
