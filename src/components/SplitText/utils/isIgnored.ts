import { isString } from '@/internal/isString';

import { ISplitTextStaticProps } from '../types';

export function isIgnored(
  element: HTMLElement,
  ignore: ISplitTextStaticProps['ignore'],
) {
  if (!ignore) {
    return false;
  }

  if (isString(ignore)) {
    return element.matches(ignore);
  }

  if (typeof ignore === 'function') {
    return ignore(element);
  }

  return ignore.includes(element);
}
