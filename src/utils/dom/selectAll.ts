import { isElement } from './isElement';
import { selectOne } from './selectOne';

export type TSelectAll = string | NodeList | Element | Element[];

type TNodeListByTagName<T extends keyof HTMLElementTagNameMap> = NodeListOf<
  HTMLElementTagNameMap[T]
>;

export function selectAll<T extends TSelectAll | keyof HTMLElementTagNameMap>(
  selector: T,
  parent?: Element | string,
): T extends Element[]
  ? Element[]
  : T extends Element
    ? Element[]
    : T extends keyof HTMLElementTagNameMap
      ? TNodeListByTagName<T>
      : NodeListOf<Element> {
  if (selector instanceof NodeList) {
    return selector as any;
  }

  if (isElement(selector)) {
    return [selector] as any;
  }

  if (Array.isArray(selector)) {
    return selector as any;
  }

  // if string
  if (typeof parent !== 'undefined') {
    const parenElement = selectOne(parent);

    if (parenElement) {
      return parenElement.querySelectorAll(selector) as any;
    }
  }

  return document.querySelectorAll(selector) as any;
}
