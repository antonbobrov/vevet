import { selectOne } from 'vevet-dom';
import { Component as ComponentClass } from '@/base/Component';
import { NSplitText } from './types';
import { onResize } from '@/utils/internal/onResize';

export type { NSplitText };

/**
 * Split text into letters, words & lines.
 * Usually used for text animation.
 */
export class SplitText<
  StaticProps extends NSplitText.IStaticProps = NSplitText.IStaticProps,
  ChangeableProps extends NSplitText.IChangeableProps = NSplitText.IChangeableProps,
  CallbacksTypes extends NSplitText.ICallbacksTypes = NSplitText.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      textSource: 'innerText',
      hasLetters: true,
      hasLines: false,
      viewportTarget: 'any',
      resizeDebounce: 0,
    };
  }

  get prefix() {
    return `${this.app.prefix}split-text`;
  }

  /** Initial text */
  private _initialText: string;

  /** Initial HTML content */
  private _initialHTML: string;

  /** If the text is already split into letters and words */
  private _isBaseSplit: boolean;

  /** Text container */
  private _container: HTMLElement;

  /** Text container */
  get container() {
    return this._container;
  }

  /** Letters */
  private _letters: NSplitText.ILetter[];

  /** Letters */
  get letters() {
    return this._letters;
  }

  /** Words */
  private _words: NSplitText.IWord[];

  /** Words */
  get words() {
    return this._words;
  }

  /** Lines */
  private _lines: NSplitText.ILine[];

  /** Lines */
  get lines() {
    return this._lines;
  }

  constructor(initialProps: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // get text container
    this._container = selectOne(this.props.container) as HTMLElement;
    this.toggleClassName(this._container, this.className(''), true);
    this._container.translate = false;

    // initial html
    this._initialHTML = this._container.innerHTML;

    // get initial text
    const innerText = this._container[this.props.textSource]!.trim();
    this._initialText = innerText || 'no rendered text';
    this._initialText = this._initialText.replace(/\s+\n/gm, '\n');
    this._initialText = this._initialText.replace(
      /<br( ?)(\/?)>/gm,
      String.fromCharCode(10)
    );

    // a11y
    this._container.ariaLabel = this._initialText;

    // set default vars
    this._isBaseSplit = false;
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
  private _setResize() {
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
    // split into words & letters
    if (!this._isBaseSplit) {
      this.container.innerHTML = '';

      this._splitIntoWords();
      this._splitIntoLetters();
      this._appendWords();

      this._isBaseSplit = true;
    }

    // split text into lines
    if (this.props.hasLines) {
      this._splitIntoLines();
    }

    // launch callbacks
    this.callbacks.tbt('split', undefined);
  }

  /** Split the text into words */
  private _splitIntoWords() {
    const chars = this._initialText.split('');

    // create words
    let wordIndex = 0;
    chars.forEach((char) => {
      const element = document.createElement('span');
      element.classList.add(this.className('__word'));
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'inline-block';

      // get an existing word or create a base for a new one
      const currentWord: NSplitText.IWord = this._words[wordIndex] ?? {
        element,
        textContent: '',
        hasNewLine: false,
        letters: [],
      };
      this._words[wordIndex] = currentWord;

      // get type of the char
      const charCode = char.charCodeAt(0);
      const isWhitespace = charCode === 32 || charCode === 160;
      const isSeparator = [45, 8208, 8211, 8212, 8722].includes(charCode);
      const isNewLine = charCode === 10;

      // add whitespace
      if (isWhitespace) {
        currentWord.whitespace = document.createTextNode(' ');
      }

      // add newline
      if (isNewLine) {
        currentWord.br = document.createElement('br');
      }

      // update word states
      currentWord.hasNewLine = isNewLine;

      // go to next word if needed
      if (isWhitespace || isNewLine) {
        wordIndex += 1;

        return;
      }

      // update contents
      currentWord.textContent += char;
      if (!this.props.hasLetters) {
        currentWord.element.innerHTML = currentWord.textContent;
      }

      // go to next word if needed
      if (isSeparator) {
        wordIndex += 1;
      }
    });

    // only filled words
    this._words = this._words.filter((word, index) => {
      if (word.textContent.length === 0) {
        if (index > 0) {
          this._words[index - 1].whitespace = word.whitespace;
          this._words[index - 1].br = word.br;
        }

        return false;
      }

      return true;
    });

    // add classnames
    let prevWord: NSplitText.IWord | undefined;
    this._words.forEach((word) => {
      if (prevWord && !!prevWord.whitespace) {
        word.element.classList.add(this.className('pre-whitespace'));
      }

      if (word.whitespace) {
        word.element.classList.add(this.className('has-whitespace'));
      }

      prevWord = word;
    });
  }

  /** Split the text into letters */
  private _splitIntoLetters() {
    // check if need to have letters
    if (!this.props.hasLetters) {
      return;
    }

    // create letters
    this._words.forEach((word) => {
      const chars = word.textContent.split('');
      const wordLetters: NSplitText.ILetter[] = [];

      chars.forEach((char) => {
        const element = document.createElement('span');
        element.classList.add(this.className('__letter'));
        element.setAttribute('aria-hidden', 'true');
        element.innerHTML = char;
        element.style.display = 'inline-block';

        const letter: NSplitText.ILetter = {
          element,
          textContent: char,
          word,
        };

        this._letters.push(letter);
        wordLetters.push(letter);
      });

      // eslint-disable-next-line no-param-reassign
      word.letters = wordLetters;
    });

    // append letters
    this._letters.forEach(({ element, word }) => {
      word.element.appendChild(element);
    });
  }

  /** Append split words to the container */
  private _appendWords() {
    this._words.forEach((word) => {
      this.container.appendChild(word.element);

      if (word.whitespace) {
        this.container.appendChild(word.whitespace);
      }

      if (word.br) {
        this.container.appendChild(word.br);
      }
    });
  }

  /** Split the text into lines */
  private _splitIntoLines() {
    // first of all, remove all previous lines
    this._removeLines();

    // create lines
    let currentLine: NSplitText.ILine | undefined;
    let prevOffsetTop = Infinity;
    let prevWord: NSplitText.IWord | undefined;

    this.words.forEach((word) => {
      // check if need to create a new line
      let isNewLine = false;
      const top = word.element.offsetTop;

      // check if the previous word contains BR
      if (!!prevWord && !!prevWord.br) {
        isNewLine = true;
      } else {
        // otherwise check offset
        isNewLine = top !== prevOffsetTop;
      }

      // update vars
      prevWord = word;
      prevOffsetTop = top;

      // create new line
      if (isNewLine) {
        const element = document.createElement('span');
        element.classList.add(this.className('__line'));
        element.setAttribute('aria-hidden', 'true');
        element.style.display = 'block';

        currentLine = {
          element,
          textContent: '',
          words: [],
        };

        this._lines.push(currentLine);
      }

      // append words
      if (currentLine) {
        currentLine.words.push(word);
      }
    });

    // update lines content
    this._lines.forEach((line) => {
      // eslint-disable-next-line no-param-reassign
      line.textContent = line.words.map((word) => word.textContent).join(' ');
    });

    // append lines
    this._lines.forEach((line) => {
      line.words.forEach((word) => {
        line.element.appendChild(word.element);

        if (word.br) {
          word.br.remove();
        }

        if (word.whitespace) {
          line.element.appendChild(word.whitespace);
        }
      });

      this.container.appendChild(line.element);
    });
  }

  /** Remove all lines */
  private _removeLines() {
    this._lines.forEach(({ element }) => element.remove());
    this._lines = [];

    this._appendWords();
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._container.innerHTML = this._initialHTML;
  }
}
