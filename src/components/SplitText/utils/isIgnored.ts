import { ISplitTextStaticProps } from '../types';

export function isIgnored(
  element: HTMLElement,
  ignore: ISplitTextStaticProps['ignore'],
) {
  if (!ignore) {
    return false;
  }

  if (typeof ignore === 'string') {
    return element.matches(ignore);
  }

  if (typeof ignore === 'function') {
    return ignore(element);
  }

  return ignore.includes(element);
}
