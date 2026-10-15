export function cnAdd(element: Element, className: string) {
  element.classList.add(className);
}

export function cnRemove(element: Element, className: string) {
  if (className) {
    element.classList.remove(className);
  }
}

export function cnToggle(element: Element, className: string, is: boolean) {
  if (className) {
    element.classList.toggle(className, is);
  }
}

export function cnHas(element: Element, className: string) {
  return element.classList.contains(className);
}
