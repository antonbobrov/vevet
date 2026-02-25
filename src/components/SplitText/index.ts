import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { onResize } from '@/utils/listeners/onResize';

import { MUTABLE_PROPS, GET_STATIC_PROPS } from './props';
import {
  ISplitTextCallbacksMap,
  ISplitTextLetterMeta,
  ISplitTextLineMeta,
  ISplitTextMutableProps,
  ISplitTextStaticProps,
  ISplitTextWordMeta,
} from './types';
import { saveInitialNodes } from './utils/saveInitialNodes';
import { splitBase } from './utils/splitBase';
import { wrapLines } from './utils/wrapLines';

export * from './types';

type TC = ISplitTextCallbacksMap;
type TS = ISplitTextStaticProps;
type TM = ISplitTextMutableProps;

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
 * [Documentation](https://vevetjs.com/docs/SplitText)
 *
 * @group Components
 */
export class SplitText extends Module<TC, TS, TM> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...GET_STATIC_PROPS(this.prefix) };
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /**
   * Saved initial HTML nodes of the container.
   */
  private _initials: ReturnType<typeof saveInitialNodes>;

  /**
   * Tracks whether the text is already split into base elements: words and letters.
   */
  private _hasSplitBase = false;

  /**
   * List of letters metadata.
   */
  private _lettersMeta: ISplitTextLetterMeta[] = [];

  /**
   * List of words metadata.
   */
  private _wordsMeta: ISplitTextWordMeta[] = [];

  /**
   * List of lines metadata.
   */
  private _linesMeta: ISplitTextLineMeta[] = [];

  /**
   * Utility for wrapping words into line containers.
   */
  private _lineSplitWrapper?: ReturnType<typeof wrapLines>;

  /**
   * Initializes the SplitText instance and saves the initial state.
   */
  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, SplitText>,
    onCallbacks?: TModuleOnCallbacksProps<TC, SplitText>,
  ) {
    super(props, onCallbacks as any);

    const { container, ariaLabel } = this.props;
    const { style } = container;

    // Add styles
    style.fontKerning = 'none';
    style.display = 'block';

    // A11Y
    if (ariaLabel) {
      container.setAttribute(
        'aria-label',
        typeof ariaLabel === 'string' ? ariaLabel : container.textContent || '',
      );
    }

    // Disable translate
    container.translate = false;

    // Add classes
    this._addTempClassName(container, this._cn(''));

    // Save initial nodes
    this._initials = saveInitialNodes(container);

    // Set events
    this._setEvents();
  }

  /**
   * Classname prefix for styling elements.
   */
  get prefix() {
    return `${initVevet().prefix}split-text`;
  }

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
   * Sets up event listeners and handles initial splitting.
   */
  private _setEvents() {
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
  @noopIfDestroyed
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
  private _splitBase() {
    if (this._hasSplitBase) {
      return;
    }

    const {
      container,
      letterTag,
      wordTag,
      wordClass,
      letterClass,
      ignore,
      prepareText,
      wordDelimiter,
      wordDelimiterOutput,
    } = this.props;

    this._hasSplitBase = true;

    const { wordsMeta, lettersMeta } = splitBase({
      container,
      letterClassName: letterClass,
      wordClassName: wordClass,
      hasLetters: this.props.letters,
      letterTag,
      wordTag,
      ignore,
      prepareText,
      wordDelimiter,
      wordDelimiterOutput,
    });

    this._wordsMeta = wordsMeta;
    this._lettersMeta = lettersMeta;
  }

  /**
   * Wraps words into line containers.
   */
  private _splitLines() {
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
      this._initials.restore();
    } else {
      const isSuccessfulDestroy = this._lineSplitWrapper.destroy();
      this._lineSplitWrapper = undefined;

      if (isSuccessfulDestroy) {
        this._initials.restore();
      }
    }
  }
}
