import { createElement, selectOne } from 'vevet-dom';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';



export namespace NSplitText {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The text container. You may use a CSS selector or the element itself.
         * @default '#v-split-text'
         */
        container?: string | Element;
        /**
         * If need to split text into letters.
         * @default true
         */
        appendLetters?: boolean;
        /**
         * If need to split text into lines.
         * @default false
         */
        appendLines?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'split': false;
    }

    export interface Line {
        el: HTMLElement;
        content: string;
        words: NSplitText.Word[];
    }

    export interface Word {
        el: HTMLElement;
        content: string;
        hasNewLine: boolean;
        br?: HTMLBRElement;
        whitespace?: Text;
        letters: NSplitText.Letter[];
    }

    export interface Letter {
        el: HTMLElement;
        content: string;
        word: NSplitText.Word;
    }

}



/**
 * Split text into letters, words & lines
 */
export class SplitText <
    StaticProp extends NSplitText.StaticProp = NSplitText.StaticProp,
    ChangeableProp extends NSplitText.ChangeableProp = NSplitText.ChangeableProp,
    CallbacksTypes extends NSplitText.CallbacksTypes = NSplitText.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            container: `#${this.prefix}`,
            appendLetters: true,
            appendLines: false,
        };
    }

    get prefix () {
        return `${this._app.prefix}split-text`;
    }


    /**
     * Initial text
     */
    protected _initText: string;
    /**
     * Initial HTML content
     */
    protected _initHTML: string;
    /**
     * If the text is already split into letters and words
     */
    protected _isPrimarySplit: boolean;



    /**
     * Text container
     */
    get container () {
        return this._container;
    }
    protected _container!: HTMLElement;

    get letters () {
        return this._letters;
    }
    protected _letters: NSplitText.Letter[];

    get words () {
        return this._words;
    }
    protected _words: NSplitText.Word[];

    get lines () {
        return this._lines;
    }
    protected _lines: NSplitText.Line[];



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // get text container
        if (this.prop.container) {
            const container = selectOne(this.prop.container);
            if (container instanceof HTMLElement) {
                this._container = container;
            }
        }

        // add classes
        if (this._container) {
            this._container.classList.add(this.prefix);
        }

        // get initial text
        this._initHTML = this._container.innerHTML;
        this._initText = (this._container.innerText || 'no rendered text').trim();
        this._initText = this._initText.replace(/\s+\n/gm, '\n');

        // set default vars
        this._isPrimarySplit = false;
        this._letters = [];
        this._words = [];
        this._lines = [];

        // initialize the class
        if (init) {
            this.init();
        }
    }

    protected _setEvents () {
        super._setEvents();

        // split the text
        this.splitText();
        if (this.prop.appendLines) {
            this.addViewportCallback('', () => {
                this.splitText();
            });
        }
    }



    /**
     * Split the text
     */
    public splitText () {
        // split into words & letters
        if (!this._isPrimarySplit) {
            this.container.innerHTML = '';
            this._splitIntoWords();
            this._splitIntoLetters();
            this._appendWords();
            this._isPrimarySplit = true;
        }
        // split text into lines
        if (this.prop.appendLines) {
            this._splitIntoLines();
        }
        // launch callbacks
        this.callbacks.tbt('split', false);
    }



    /**
     * Split the text into words
     */
    protected _splitIntoWords () {
        const chars = this._initText.split('');

        // create words
        let wordIndex = 0;
        chars.forEach((char) => {
            // get an existing word or create a base for a new one
            const currentWord: NSplitText.Word = this._words[wordIndex] || {
                content: '',
                hasNewLine: false,
                el: createElement('span', {
                    class: `${this.prefix}__word`,
                }),
                letters: [],
            };
            currentWord.el.style.display = 'inline-block';
            this._words[wordIndex] = currentWord;

            // get type of the char
            const charCode = char.charCodeAt(0);
            const isWhitespace = charCode === 32 || charCode === 160;
            const isNewLine = charCode === 10;

            // add elements
            if (isWhitespace) {
                currentWord.whitespace = document.createTextNode(' ');
            }
            if (isNewLine) {
                currentWord.br = createElement('br');
            }

            // update word states
            currentWord.hasNewLine = isNewLine;
            // go to next word if needed
            if (isWhitespace || isNewLine) {
                wordIndex += 1;
                return;
            }

            // update contents
            currentWord.content += char;
            if (!this.prop.appendLetters) {
                currentWord.el.innerHTML = currentWord.content;
            }
        });
    }

    /**
     * Append split words to the container
     */
    protected _appendWords () {
        this._words.forEach((word) => {
            this.container.appendChild(word.el);
            if (word.whitespace) {
                this.container.appendChild(word.whitespace);
            }
            if (word.br) {
                this.container.appendChild(word.br);
            }
        });
    }

    /**
     * Remove split words from DOM
     */
    protected _removeWords () {
        this._words.forEach((word) => {
            word.el.remove();
            if (word.whitespace) {
                word.whitespace.remove();
            }
            if (word.br) {
                word.br.remove();
            }
        });
    }



    /**
     * Split the text into letters
     */
    protected _splitIntoLetters () {
        // check if need to have letters
        if (!this.prop.appendLetters) {
            return;
        }

        // create letters
        this._words.forEach((word) => {
            const chars = word.content.split('');
            const wordLetters: NSplitText.Letter[] = [];
            chars.forEach((char) => {
                const letter = {
                    el: createElement('span', {
                        class: `${this.prefix}__letter`,
                        html: char,
                    }),
                    content: char,
                    word,
                };
                letter.el.style.display = 'inline-block';
                this._letters.push(letter);
                wordLetters.push(letter);
            });
            word.letters = wordLetters;
        });

        // append letters
        this._letters.forEach((letter) => {
            letter.word.el.appendChild(letter.el);
        });
    }



    /**
     * Split the text into lines
     */
    protected _splitIntoLines () {
        // first of all, remove all previous lines
        this._removeLines();

        // create lines
        let currentLine: NSplitText.Line | false = false;
        let prevOffsetTop = Infinity;
        let prevWord: NSplitText.Word | false = false;
        this.words.forEach((word) => {
            // check if need to create a new line
            let isNewLine = false;
            const top = word.el.offsetTop;
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
                currentLine = {
                    el: createElement('span', {
                        class: `${this.prefix}__line`,
                    }),
                    content: '',
                    words: [],
                };
                currentLine.el.style.display = 'block';
                this._lines.push(currentLine);
            }

            // append words
            if (currentLine) {
                currentLine.words.push(word);
            }
        });

        // update lines content
        this._lines.forEach((line) => {
            line.content = line.words.map((word) => word.content).join(' ');
        });

        // append lines
        this._lines.forEach((line) => {
            line.words.forEach((word) => {
                line.el.appendChild(word.el);
                if (word.br) {
                    word.br.remove();
                }
                if (word.whitespace) {
                    line.el.appendChild(word.whitespace);
                }
            });
            this.container.appendChild(line.el);
        });
    }

    /**
     * Remove all lines
     */
    protected _removeLines () {
        // remove lines
        this._lines.forEach((line) => {
            line.el.remove();
        });
        this._lines = [];
        // and append words
        this._appendWords();
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();

        this._lines = [];
        this._words = [];
        this._letters = [];

        this._container.innerHTML = this._initHTML;
    }
}