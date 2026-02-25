import { TRequiredProps } from '@/internal/requiredProps';

import { ISplitTextStaticProps, ISplitTextMutableProps } from './types';

export const GET_STATIC_PROPS = (
  prefix: string,
): TRequiredProps<ISplitTextStaticProps> => ({
  __staticProp: true,
  container: null as any,
  ariaLabel: true,
  letters: false,
  lines: false,
  linesWrapper: false,
  letterTag: 'span',
  wordTag: 'span',
  lineTag: 'span',
  letterClass: `${prefix}__letter`,
  wordClass: `${prefix}__word`,
  lineClass: `${prefix}__line`,
  lineWrapperClass: `${prefix}__line-wrapper`,
  resizeDebounce: 0,
  ignore: null as any,
  prepareText: (text) => text,
  wordDelimiter: String.fromCharCode(32),
  wordDelimiterOutput: null as any,
});

export const MUTABLE_PROPS: TRequiredProps<ISplitTextMutableProps> = {
  __mutableProp: true,
};
