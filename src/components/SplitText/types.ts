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
