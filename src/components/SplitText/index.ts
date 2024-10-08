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
 * It supports auto-resizing for lines and styled content when using HTML inside your text.
 *
 * Inspired by GSAP's SplitText plugin and SplitType.
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

  /**
   * Class name used for individual letters.
   */
  get letterClassName() {
    return this.className('__letter');
  }

  /**
   * Class name used for individual words.
   */
  get wordClassName() {
    return this.className('__word');
  }

  /**
   * Class name used for individual lines.
   */
  get lineClassName() {
    return this.className('__line');
  }

  /**
   * Initial HTML content of the container before splitting.
   */
  protected _initialHTML: string;

  /**
   * Tracks if the text has already been split into base elements (words & letters).
   */
  protected _isBaseSplit = false;

  /**
   * The text container where the split text is stored.
   */
  protected _container: HTMLElement;

  /**
   * Returns the text container element.
   */
  get container() {
    return this._container;
  }

  /**
   * List of letter elements generated after splitting.
   */
  protected _letters: NSplitText.ILetter[];

  /**
   * Returns the list of letter elements.
   */
  get letters() {
    return this._letters;
  }

  /**
   * List of word elements generated after splitting.
   */
  protected _words: NSplitText.IWord[];

  /**
   * Returns the list of word elements.
   */
  get words() {
    return this._words;
  }

  /**
   * List of line elements generated after splitting.
   */
  protected _lines: NSplitText.ILine[];

  /**
   * Returns the list of line elements.
   */
  get lines() {
    return this._lines;
  }

  /**
   * Result from `wrapLines` utility used to manage the split lines.
   * @ignore
   */
  protected _lineWrapper?: ReturnType<typeof wrapLines>;

  constructor(initialProps: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // Get text container
    this._container = selectOne(this.props.container) as HTMLElement;
    this.toggleClassName(this._container, this.className(''), true);

    // Disable translation for text elements
    this._container.translate = false;

    // Store initial HTML content
    this._initialHTML = this._container.innerHTML;

    // Initialize default properties
    this._letters = [];
    this._words = [];
    this._lines = [];

    if (canInit) {
      this.init();
    }
  }

  /**
   * Initializes the component.
   */
  protected _init() {
    super._init();

    this._setResize();
  }

  /**
   * Sets up resize events for the component, allowing it to respond to viewport or container size changes.
   */
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

  /**
   * Splits the text in the container into letters, words, and optionally lines, based on the component properties.
   */
  public splitText() {
    this.callbacks.tbt('beforeSplit', undefined);

    this._splitBase();

    if (this.props.hasLines) {
      this._splitIntoLines();
    }

    this.callbacks.tbt('split', undefined);
  }

  /**
   * Splits the text into base elements (letters and words).
   */
  private _splitBase() {
    if (this._isBaseSplit) {
      return;
    }

    const { container, letterClassName, wordClassName } = this;
    const { letterTag, wordTag } = this.props;

    this._isBaseSplit = true;

    const { helper, words, letters } = splitBase({
      container,
      letterClassName,
      wordClassName,
      hasLetters: this.props.hasLetters,
      letterTag,
      wordTag,
    });

    // Clear the original content
    while (container.childNodes[0]) {
      container.childNodes[0].remove();
    }

    // Append the new elements
    while (helper.childNodes[0]) {
      container.appendChild(helper.childNodes[0]);
    }

    // Update elements
    this._words = words;
    this._letters = letters;
  }

  /**
   * Splits the text into lines by wrapping word elements into line containers.
   */
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

  /**
   * Destroys the component, restoring the container to its initial HTML state.
   */
  protected _destroy() {
    super._destroy();

    this._container.innerHTML = this._initialHTML;
  }
}
