function childOfCheck(el: Element, parent: Element): boolean {
  if (el === parent) {
    return true;
  }

  if (el !== null) {
    return childOfCheck(el.parentNode as Element, parent);
  }

  return false;
}

export function childOf(element: Element, parent: Element) {
  return childOfCheck(element, parent);
}
