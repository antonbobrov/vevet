import { Module, TModuleProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { isString } from '@/internal/isString';
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
 * Splits text in a container into words, letters, and optionally lines.
 *
 * Preserves inline HTML, supports resize-driven line reflow, and restores
 * the original DOM on {@link destroy}.
 *
 * Apply `font-kerning: none` on the container to reduce layout shift.
 *
 * [Documentation](https://vevetjs.com/docs/SplitText)
 *
 * @group Components
 */
export class SplitText extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...GET_STATIC_PROPS(this.prefix) };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _initials: ReturnType<typeof saveInitialNodes>;

  /** Whether {@link splitBase} has already wrapped words / letters. */
  private _isBaseSplit = false;

  private _lettersMeta: ISplitTextLetterMeta[] = [];

  private _wordsMeta: ISplitTextWordMeta[] = [];

  private _linesMeta: ISplitTextLineMeta[] = [];

  private _lineSplitWrapper?: ReturnType<typeof wrapLines>;

  constructor(props?: TModuleProps<TC, TS, TM, SplitText>) {
    super(props);

    const { container, ariaLabel } = this.props;
    const { style } = container;

    style.fontKerning = 'none';
    style.display = 'block';

    if (ariaLabel) {
      container.setAttribute(
        'aria-label',
        isString(ariaLabel) ? ariaLabel : container.textContent || '',
      );
    }

    container.translate = false;

    this._addTempClassName(container, '');

    this._initials = saveInitialNodes(container);

    this._setEvents();
  }

  /** Class name prefix for split elements (`{corePrefix}split-text`). */
  get prefix() {
    return `${initVevet().prefix}split-text`;
  }

  /** Letter metadata from the last split. */
  get lettersMeta() {
    return this._lettersMeta;
  }

  /** Letter elements from the last split. */
  get letters() {
    return this._lettersMeta.map((letter) => letter.element);
  }

  /** Word metadata from the last split. */
  get wordsMeta() {
    return this._wordsMeta;
  }

  /** Word elements from the last split. */
  get words() {
    return this._wordsMeta.map((word) => word.element);
  }

  /** Line metadata from the last split (empty when `lines` is `false`). */
  get linesMeta() {
    return this._linesMeta;
  }

  /** Line elements from the last split (empty when `lines` is `false`). */
  get lines() {
    return this._linesMeta.map((line) => line.element);
  }

  /**
   * Runs an initial split or attaches a resize listener when `lines` is enabled.
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
   * Splits text into words, letters, and optionally lines.
   *
   * Emits `beforeSplit`, performs DOM work, then emits `split`.
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

  /** Wraps words and letters once; subsequent calls are no-ops. */
  private _splitBase() {
    if (this._isBaseSplit) {
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

    this._isBaseSplit = true;

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
   * Groups words into line wrappers from layout positions.
   *
   * No-op when the container is hidden (`offsetParent === null`).
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
   * Stops listeners, unwraps lines when possible, and restores saved DOM.
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
