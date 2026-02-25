import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

/** Static properties for the SplitText module */
export interface ISplitTextStaticProps extends IModuleStaticProps {
  /**
   * The text container where the text will be split.
   */
  container: HTMLElement;

  /**
   * Allow aria-label. `false` prevents adding aria-label attributes to container. String value overrides the default aria-label.
   * @default true
   */
  ariaLabel?: boolean | string;

  /**
   * Specifies whether the text should be split into individual letters.
   * @default false
   */
  letters?: boolean;

  /**
   * Specifies whether the text should be split into lines.
   * @default false
   */
  lines?: boolean;

  /**
   * Specifies whether to wrap each line in an additional container.
   * @default false
   */
  linesWrapper?: boolean;

  /**
   * HTML tag to wrap each letter.
   * @default `span`
   */
  letterTag?: keyof HTMLElementTagNameMap;

  /**
   * HTML tag to wrap each word.
   * @default `span`
   */
  wordTag?: keyof HTMLElementTagNameMap;

  /**
   * HTML tag to wrap each line.
   * @default `span`
   */
  lineTag?: keyof HTMLElementTagNameMap;

  /**
   * Letter class name.
   * @default `v-split-text__letter`
   */
  letterClass?: string;

  /**
   * Word class name.
   * @default `v-split-text__word`
   */
  wordClass?: string;

  /**
   * Line class name.
   * @default `v-split-text__line`
   */
  lineClass?: string;

  /**
   * Line wrapper class name.
   * @default `v-split-text__line-wrapper`
   */
  lineWrapperClass?: string;

  /**
   * The debounce delay for the resize event in milliseconds.
   * @default 0
   */
  resizeDebounce?: number;

  /**
   * Do not split certain elements. Supports string selectors, array of elements, or function.
   * @default null
   */
  ignore?: string | HTMLElement[] | ((element: HTMLElement) => boolean) | null;

  /**
   * Optional callback to preprocess text before it is split into words.
   * This function receives the original text and should return the modified text.
   * It is useful for languages like Chinese where standard word splitting may not work correctly.
   * 
   * @example
   * 
   * const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
   * 
   * const instance = new SplitText({
   *   container,
   *   prepareText: (source) => [...segmenter.segment(source)].map((s) => s.segment).join(' '),
    });
   */
  prepareText?: (text: string) => string;

  /**
   * Specifies a custom delimiter used to split text into words.
   * By default, splitting occurs on regular whitespace.
   * @default " "
   */
  wordDelimiter?: string;

  /**
   * Provides an alternative delimiter to use when outputting the split words.
   * Useful when a custom input delimiter is used but the output should differ.
   * @default null
   */
  wordDelimiterOutput?: string | null;
}

/** Mutable properties for the SplitText module */
export interface ISplitTextMutableProps extends IModuleMutableProps {}

/** Callbacks map for the SplitText module */
export interface ISplitTextCallbacksMap extends IModuleCallbacksMap {
  /**
   * Called before the text is split.
   */
  beforeSplit: undefined;

  /**
   * Called after the text has been split.
   */
  split: undefined;
}

/** SplitText Line Metadata */
export interface ISplitTextLineMeta {
  /**
   * HTML element representing a single line of split text.
   */
  element: HTMLElement;

  /**
   * HTML element representing a wrapper for the line element. Useful for animating the line with masks.
   *
   * The element is created when `props.hasLinesWrapper` is `true`.
   */
  wrapper?: HTMLElement;

  /**
   * Array of word objects within the line.
   */
  words: ISplitTextWordMeta[];
}

/** SplitText Word Metadata */
export interface ISplitTextWordMeta {
  /**
   * HTML element representing a single word.
   */
  element: HTMLElement;

  /**
   * Array of letter objects within the word.
   */
  letters: ISplitTextLetterMeta[];
}

/** SplitText Letter Metadata */
export interface ISplitTextLetterMeta {
  /**
   * HTML element representing a single letter.
   */
  element: HTMLElement;
}
