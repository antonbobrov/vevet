import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module/types';

export interface ISplitTextStaticProps extends IModuleStaticProps {
  /** Container whose text content is split. */
  container: HTMLElement;

  /**
   * Accessible label for the container after splitting.
   *
   * - `true` — uses `textContent` as `aria-label`
   * - `false` — does not set `aria-label`
   * - `string` — uses the provided value
   * @default true
   */
  ariaLabel?: boolean | string;

  /**
   * Split each word into individual letter elements.
   * @default false
   */
  letters?: boolean;

  /**
   * Group words into line elements (reflows on resize).
   * @default false
   */
  lines?: boolean;

  /**
   * Wrap each line in an extra element (useful for mask animations).
   * @default false
   */
  linesWrapper?: boolean;

  /**
   * HTML tag for letter wrappers.
   * @default `span`
   */
  letterTag?: keyof HTMLElementTagNameMap;

  /**
   * HTML tag for word wrappers.
   * @default `span`
   */
  wordTag?: keyof HTMLElementTagNameMap;

  /**
   * HTML tag for line wrappers.
   * @default `span`
   */
  lineTag?: keyof HTMLElementTagNameMap;

  /**
   * CSS class for letter elements.
   * @default `{prefix}__letter`
   */
  letterClass?: string;

  /**
   * CSS class for word elements.
   * @default `{prefix}__word`
   */
  wordClass?: string;

  /**
   * CSS class for line elements.
   * @default `{prefix}__line`
   */
  lineClass?: string;

  /**
   * CSS class for line wrapper elements.
   * @default `{prefix}__line-wrapper`
   */
  lineWrapperClass?: string;

  /**
   * Debounce delay for resize-driven line reflow (ms).
   * @default 0
   */
  resizeDebounce?: number;

  /**
   * Elements excluded from splitting (selector, list, or predicate).
   * @default null
   */
  ignore?: string | HTMLElement[] | ((element: HTMLElement) => boolean) | null;

  /**
   * Preprocesses text before word splitting (e.g. CJK segmentation).
   *
   * @example
   *
   * const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
   *
   * const instance = new SplitText({
   *   container,
   *   prepareText: (source) => [...segmenter.segment(source)].map((s) => s.segment).join(' '),
   * });
   */
  prepareText?: (text: string) => string;

  /**
   * Delimiter used to split text into words.
   * @default whitespace
   */
  wordDelimiter?: string;

  /**
   * Delimiter inserted between words in the DOM (defaults to `wordDelimiter`).
   * @default null
   */
  wordDelimiterOutput?: string | null;
}

export interface ISplitTextMutableProps extends IModuleMutableProps {}

export interface ISplitTextCallbacksMap extends IModuleCallbacksMap<ISplitTextMutableProps> {
  /** Fired at the start of {@link SplitText.split}. */
  beforeSplit: undefined;

  /** Fired after {@link SplitText.split} completes. */
  split: undefined;
}

/** Metadata for a split line. */
export interface ISplitTextLineMeta {
  /** Line element containing word nodes. */
  element: HTMLElement;

  /**
   * Optional outer wrapper when `linesWrapper` is `true`.
   */
  wrapper?: HTMLElement;

  /** Words that belong to this line. */
  words: ISplitTextWordMeta[];
}

/** Metadata for a split word. */
export interface ISplitTextWordMeta {
  /** Word element. */
  element: HTMLElement;

  /** Letter elements inside the word (empty when `letters` is `false`). */
  letters: ISplitTextLetterMeta[];
}

/** Metadata for a split letter. */
export interface ISplitTextLetterMeta {
  /** Letter element. */
  element: HTMLElement;
}
