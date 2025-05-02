import { onResize } from '@/utils/listeners/onResize';
import { splitBase } from './utils/splitBase';
import { wrapLines } from './utils/wrapLines';
import {
  ISplitTextCallbacksMap,
  ISplitTextLetterMeta,
  ISplitTextLineMeta,
  ISplitTextMutableProps,
  ISplitTextStaticProps,
  ISplitTextWordMeta,
} from './types';
import { Module } from '@/base';
import { TRequiredProps } from '@/internal/requiredProps';
import { initVevet } from '@/global/initVevet';
import { saveInitialNodes } from './utils/saveInitialNodes';

export * from './types';

/**
 * `SplitText` splits text within a container into individual lines, words, and letters.
 *
 * Features:
 * - Supports resizing, HTML content, and special symbols like emojis.
 * - Handles multi-line breaks and non-breaking spaces.
 * - Saves initial nodes for easy restoration.
 * - Allows splitting into lines, words, or letters as needed.
 *
 * **Note**: Apply `fontKerning: none` to prevent layout shifts.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/SplitText)
 *
 * @group Components
 */
export class SplitText<
  CallbacksMap extends ISplitTextCallbacksMap = ISplitTextCallbacksMap,
  StaticProps extends ISplitTextStaticProps = ISplitTextStaticProps,
  MutableProps extends ISplitTextMutableProps = ISplitTextMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /**
   * Retrieves the default static properties.
   */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      letters: false,
      lines: false,
      linesWrapper: false,
      letterTag: 'span',
      wordTag: 'span',
      lineTag: 'span',
      letterClass: this._cn('__letter'),
      wordClass: this._cn('__word'),
      lineClass: this._cn('__line'),
      lineWrapperClass: this._cn('__line-wrapper'),
      resizeDebounce: 0,
    } as TRequiredProps<StaticProps>;
  }

  /**
   * Retrieves the default mutable properties.
   */
  public _getMutable(): TRequiredProps<MutableProps> {
    return { ...super._getMutable() } as TRequiredProps<MutableProps>;
  }

  /**
   * Classname prefix for styling elements.
   */
  get prefix() {
    return `${initVevet().prefix}split-text`;
  }

  /**
   * Saved initial HTML nodes of the container.
   */
  protected _savedNodes: ReturnType<typeof saveInitialNodes>;

  /**
   * Tracks whether the text is already split into base elements: words and letters.
   */
  protected _isBaseSplit = false;

  /**
   * List of letters metadata.
   */
  protected _lettersMeta: ISplitTextLetterMeta[] = [];

  /**
   * Retrieves an array of letters metadata.
   */
  get lettersMeta() {
    return this._lettersMeta;
  }

  /**
   * Retrieves an array of letter elements.
   */
  get letters() {
    return this._lettersMeta.map((letter) => letter.element);
  }

  /**
   * List of words metadata.
   */
  protected _wordsMeta: ISplitTextWordMeta[] = [];

  /**
   * Retrieves an array of words metadata.
   */
  get wordsMeta() {
    return this._wordsMeta;
  }

  /**
   * Retrieves an array of word elements.
   */
  get words() {
    return this._wordsMeta.map((word) => word.element);
  }

  /**
   * List of lines metadata.
   */
  protected _linesMeta: ISplitTextLineMeta[] = [];

  /**
   * Retrieves an array of lines metadata.
   */
  get linesMeta() {
    return this._linesMeta;
  }

  /**
   * Retrieves an array of line elements.
   */
  get lines() {
    return this._linesMeta.map((line) => line.element);
  }

  /**
   * Utility for wrapping words into line containers.
   */
  protected _lineSplitWrapper?: ReturnType<typeof wrapLines>;

  /**
   * Initializes the SplitText instance and saves the initial state.
   */
  constructor(props?: StaticProps & MutableProps) {
    super(props);

    const { container } = this.props;

    container.style.fontKerning = 'none';
    container.setAttribute('aria-label', container.textContent || '');

    this._addTempClassName(container, this._cn(''));

    container.translate = false;

    this._savedNodes = saveInitialNodes(container);

    this._setup();
  }

  /**
   * Sets up event listeners and handles initial splitting.
   */
  protected _setup() {
    const { container, resizeDebounce } = this.props;

    if (!this.props.lines) {
      this.split();

      return;
    }

    const resizeHandler = onResize({
      callback: () => this.split(),
      element: container,
      viewportTarget: 'width',
      resizeDebounce,
      name: this.name,
    });

    resizeHandler.resize();

    this.onDestroy(() => resizeHandler.remove());
  }

  /**
   * Splits the text into letters, words, and optionally lines based on configuration.
   */
  public split() {
    this.callbacks.emit('beforeSplit', undefined);

    this._splitBase();

    if (this.props.lines) {
      this._splitLines();
    }

    this.callbacks.emit('split', undefined);
  }

  /**
   * Splits text into base elements: letters and words.
   */
  protected _splitBase() {
    if (this._isBaseSplit) {
      return;
    }

    const { container, letterTag, wordTag, wordClass, letterClass } =
      this.props;

    this._isBaseSplit = true;

    const { wordsMeta, lettersMeta } = splitBase({
      container,
      letterClassName: letterClass,
      wordClassName: wordClass,
      hasLetters: this.props.letters,
      letterTag,
      wordTag,
    });

    this._wordsMeta = wordsMeta;
    this._lettersMeta = lettersMeta;
  }

  /**
   * Wraps words into line containers.
   */
  protected _splitLines() {
    const { wordsMeta } = this;
    const { container, lineTag, lineClass, lineWrapperClass } = this.props;

    const isHidden = container.offsetParent === null;
    if (isHidden) {
      return;
    }

    this._lineSplitWrapper?.destroy();

    this._lineSplitWrapper = wrapLines({
      container,
      hasLinesWrapper: this.props.linesWrapper,
      wordsMeta,
      lineClassName: lineClass,
      lineWrapperClassName: lineWrapperClass,
      tagName: lineTag,
    });

    this._linesMeta = this._lineSplitWrapper.linesMeta;
  }

  /**
   * Destroys the component.
   * This method does not restore the initial nodes. For this purpose, use `restore()`.
   */
  protected _destroy() {
    super._destroy();

    if (!this._lineSplitWrapper) {
      this._savedNodes.restore();
    } else {
      const isSuccessfulDestroy = this._lineSplitWrapper.destroy();
      this._lineSplitWrapper = undefined;

      if (isSuccessfulDestroy) {
        this._savedNodes.restore();
      }
    }
  }
}
