import { selectOne } from 'vevet-dom';
import { Component as ComponentClass } from '@/base/Component';
import { NSplitText } from './types';
import { onResize } from '@/utils/listeners/onResize';
import { splitBase } from './utils/splitBase';
import { wrapLines } from './utils/wrapLines';
import { getApp } from '@/utils/internal/getApp';

export type { NSplitText };

/**
 * SplitText is a component that splits your text into lines, words, and letters so that you can animate them.
 * It supports auto-resizing for lines and styled content when using html inside your text.
 * It was inspired both by GSAP's SplitText plugin and SplitType.
 *
 * P.S. Apply `fontKerning: none` to your container to prevent large layout shifts.
 *
 * @see Performance comparison of splitting your text into words: https://measurethat.net/Benchmarks/Show/31805/0/vevetsplittext-splittype-comparison-words-only
 *
 * @see Performance comparison of splitting your text into words and letters: https://measurethat.net/Benchmarks/Show/31806/0/vevetsplittext-splittype-comparison-words-letters
 *
 * @see Performance comparison of splitting your text into words and lines: https://measurethat.net/Benchmarks/Show/31847/0/vevetsplittext-splittype-comparison-words-lines
 */
export class SplitText<
  StaticProps extends NSplitText.IStaticProps = NSplitText.IStaticProps,
  ChangeableProps extends
    NSplitText.IChangeableProps = NSplitText.IChangeableProps,
  CallbacksTypes extends
    NSplitText.ICallbacksTypes = NSplitText.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      hasLetters: true,
      hasLines: false,
      letterTag: 'span',
      wordTag: 'span',
      lineTag: 'span',
      viewportTarget: 'any',
      resizeDebounce: 0,
    };
  }

  get prefix() {
    return `${getApp().prefix}split-text`;
  }

  get letterClassName() {
    return this.className('__letter');
  }

  get wordClassName() {
    return this.className('__word');
  }

  get lineClassName() {
    return this.className('__line');
  }

  /** Initial HTML content */
  protected _initialHTML: string;

  /** If the text is already split into words & letters */
  protected _isBaseSplit = false;

  /** Text container */
  protected _container: HTMLElement;

  /** Text container */
  get container() {
    return this._container;
  }

  /** Letters */
  protected _letters: NSplitText.ILetter[];

  /** Letters */
  get letters() {
    return this._letters;
  }

  /** Words */
  protected _words: NSplitText.IWord[];

  /** Words */
  get words() {
    return this._words;
  }

  /** Lines */
  protected _lines: NSplitText.ILine[];

  /** Lines */
  get lines() {
    return this._lines;
  }

  /** What `wrapLines` returns */
  protected _lineWrapper?: ReturnType<typeof wrapLines>;

  constructor(initialProps: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // get text container
    this._container = selectOne(this.props.container) as HTMLElement;
    this.toggleClassName(this._container, this.className(''), true);

    // attributes
    this._container.translate = false;

    // save initial html
    this._initialHTML = this._container.innerHTML;

    // set default vars
    this._letters = [];
    this._words = [];
    this._lines = [];

    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setResize();
  }

  /** Set resize events */
  protected _setResize() {
    const { viewportTarget, resizeDebounce, hasLines } = this.props;

    if (!hasLines) {
      this.splitText();

      return;
    }

    const resizeHandler = onResize({
      onResize: () => this.splitText(),
      element: this.container,
      viewportTarget,
      resizeDebounce,
    });

    resizeHandler.resize();

    this.addDestroyableAction(() => resizeHandler.remove());
  }

  /** Split the text */
  public splitText() {
    // launch callbacks
    this.callbacks.tbt('beforeSplit', undefined);

    // split intro base elements
    this._splitBase();

    // split text into lines
    if (this.props.hasLines) {
      this._splitIntoLines();
    }

    // launch callbacks
    this.callbacks.tbt('split', undefined);
  }

  /** Split base */
  private _splitBase() {
    if (this._isBaseSplit) {
      return;
    }

    const { container, letterClassName, wordClassName } = this;
    const { letterTag, wordTag } = this.props;

    this._isBaseSplit = true;

    // split text

    const { helper, words, letters } = splitBase({
      container,
      letterClassName,
      wordClassName,
      hasLetters: this.props.hasLetters,
      letterTag,
      wordTag,
    });

    // append nodes

    while (container.childNodes[0]) {
      container.childNodes[0].remove();
    }

    while (helper.childNodes[0]) {
      container.appendChild(helper.childNodes[0]);
    }

    // update elements
    this._words = words;
    this._letters = letters;
  }

  /** Split the text into lines */
  protected _splitIntoLines() {
    const { container, words, lineClassName } = this;
    const { lineTag } = this.props;

    const isHidden = container.offsetParent === null;
    if (isHidden) {
      return;
    }

    this._lineWrapper?.destroy();

    this._lineWrapper = wrapLines({
      container,
      words,
      className: lineClassName,
      tagName: lineTag,
    });

    this._lines = this._lineWrapper.lines;
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._container.innerHTML = this._initialHTML;
  }
}
