import { isElement } from './isElement';
import { isWindow } from './isWindow';

export type TSelectOne = string | Element | Window;

export function selectOne<T extends TSelectOne | keyof HTMLElementTagNameMap>(
  selector: T,
  parent?: Element | string,
): T extends Window
  ? Window
  : T extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[T]
    : HTMLElement | Element | null {
  if (isWindow(selector)) {
    return selector as any;
  }

  if (isElement(selector)) {
    return selector as any;
  }

  // if string
  if (typeof parent !== 'undefined') {
    const parenEl = selectOne(parent);
    if (parenEl) {
      return parenEl.querySelector(selector as string) as any;
    }
  }

  return document.querySelector(selector as string) as any;
}
