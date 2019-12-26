const dom = require('dom-create-element');

import Module from '../Module';
import utils from '../../core/utils';

/**
 * @classdesc Split text into letters, words & lines. <br>
 *  Available targets:
 *  <ul>
 *      <li>resize - when window is resizes.</li>
 *      <li>split - when the text is splitted into letters, words & lines.</li>
 *  </ul>
 * <br><br> <b>import {TextSplit} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class TextSplit extends Module {


    
    /**
     * @memberof Vevet.TextSplit
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement} [selector=.vevet-textSplit] - *** Element with text.
     * @property {number} [resizeTimeout=0] - Timeout before lines are updated when the window is resized.
     * @property {boolean} [appendLetters=true] - *** Defines if we need to wrap each char into a span.
     * @property {boolean} [appendWords=true] - *** Defines if we need to wrap each word into a span.
     * @property {boolean} [appendLines=false] - *** Defines if we need to wrap each line into a span.
     */
    /**
     * @alias Vevet.TextSplit
     * 
     * @param {Vevet.TextSplit.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}text-split`;
    }

    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            selector: `.${this._prefix}`,
            resizeTimeout: 0,
            appendLetters: true,
            appendWords: true,
            appendLines: false
        });

    }



    /**
     * @memberof Vevet.TextSplit
     * @typedef {object} Letter
     * @property {HTMLElement|boolean} el Defines the span element itself.
     * @property {string} content Defines innerHTML of the element.
     * @property {boolean} newline Defines if the element precedes a new line.
     * @property {boolean} whitespace Defines if the element precedes a whitespace.
     * @property {string} type Defines the type of the element.
     */
    /**
     * @description Get letters.
     * @readonly
     * @type {Array<Vevet.TextSplit.Letter>}
     */
    get letters() {
        return this._el.letters;
    }

    /**
     * @memberof Vevet.TextSplit
     * @typedef {object} Word
     * @property {HTMLElement|boolean} el Defines the span element itself.
     * @property {string} content Defines the contents of all letters inside the word.
     * @property {Array<Vevet.TextSplit.Letter>} children All letters inside the word.
     * @property {boolean} newline Defines if the element precedes a new line.
     * @property {string} type Defines the type of the element.
     */
    /**
     * @description Get words.
     * @readonly
     * @type {Array<Vevet.TextSplit.Word>}
     */
    get words() {
        return this._el.words;
    }

    /**
     * @memberof Vevet.TextSplit
     * @typedef {object} Line
     * @property {HTMLElement|boolean} el Defines the span element itself.
     * @property {string} content The contents of all words inside of the line.
     * @property {Array<Vevet.TextSplit.Word|Vevet.TextSplit.Letter>} children All words inside of the line.
     * @property {string} type Defines the type of the element.
     */
    /**
     * @description Get lines.
     * @readonly
     * @type {Array<Vevet.TextSplit.Line>}
     */
    get lines() {
        return this._el.lines;
    }

    /**
     * @memberof Vevet.TextSplit
     * @typedef {object} Elements
     * @property {Array<Vevet.TextSplit.Letter>} letters
     * @property {Array<Vevet.TextSplit.Word>} words
     * @property {Array<Vevet.TextSplit.Line>} lines
     */
    /**
     * @description Get all elements of the text.
     * @readonly
     * @type {Vevet.TextSplit.Elements}
     */
    get elements() {
        return this._el;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        // get outer
        this._outer = utils.element(this._prop.selector);
        let outer = this._outer;
        outer.classList.add(`${this._prefix}`);

        // variables
        this._text = outer.innerText;
        if (this._text.length == 0) {
            this._text = outer.textContent;
        }
        this._html = outer.innerHTML;

        // defines if the text is already split into letters & words
        this._splitBool = false;

        // create elements
        this._el = {
            letters: [],
            words: [],
            lines: []
        };

        // split text
        this.split();

    }



    // Set events
    _setEvents() {

        super._setEvents();

        this._addEvent("viewport", {
            target: 'w_',
            name: this.name,
            do: () => {
                this._resize();
            },
        });

    }

    /**
     * @description Resize & split.
     * @protected
     */
    _resize() {
        
        setTimeout(() => {
            this._resizeFunc();
        }, this._prop.resizeTimeout);
        
    }

    /**
     * @description Split on resize.
     * @protected
     */
    _resizeFunc() {

        this.split();
        this.lbt("resize");
        
    }



    /**
     * @description Split the text into letters, words and lines.
     * If the text is already split into words and letters, a new array of lines containing words 
     * will be formed. See {@linkcode Vevet.TextSplit.Elements}
     */
    split() {

        // get prop
        let prop = this._prop;

        // perhaps, you will need thid class
        // it is added when the text is being split
        // and it removes  when it is already split
        this._outer.classList.add(`${this._prefix}_splitting`);

        // split text into letters and words
        if (!this._splitBool) {
            
            // split
            this._wordsSplit();
            this._lettersSplit();

            // clear innerHTML
            this._outer.innerHTML = '';

            // and append
            this._lettersAppend();
            this._wordsAppend();

        }

        // remove previous lines
        if (this._splitBool) {
            this._linesRemove();
        }

        // append spaces
        if (!prop.appendLines) {
            if (!this._splitBool) {
                this._appendSpaces();
            }
        }

        // split to lines
        if (prop.appendLines) {
            this._appendSpaces();
            this._linesSplit();
            this._removeBr();
            this._linesAppend();
            this._appendSpaces();
        }
        else {
            this._linesSplit();
        }

        // change value
        this._splitBool = true;

        // remove the class
        this._outer.classList.remove(`${this._prefix}_splitting`);

        // launch callback
        this.lbt("split", this._el);

    }



    /**
     * @description Split text into words.
     * @protected
     */
    _wordsSplit() {

        // split text to chars
        let chars = this._text.split(""),
            el = [],
            word = [];

        // gor thru all chars and add them to single words
        let i = 0;
        chars.forEach((char) => {

            let whitespace = false,
                newline = false,
                charCode = char.charCodeAt(0),
                newWord = false,
                lastChar = i == (chars.length - 1);
            
            // if a whitespace
            if (charCode === 32 || charCode === 160) {
                whitespace = true;
            }
            // if a new line
            else if (charCode === 10) {
                newline = true;
            }

            // define if a new word
            if (newline || whitespace || lastChar) {
                newWord = true;
                if (lastChar) {
                    word.push(char);
                }
            }

            // if a new word
            if (newWord) {
                // add previous word to elements
                if (word.length > 0) {
                    el.push({
                        el: false,
                        children: word,
                        newline: newline,
                        content: word.join(""),
                        type: 'word'
                    });
                }
                word = [];
            }
            else {
                word.push(char);
            }

            // iteration
            i++;

        });

        // add elements to words
        if (this._prop.appendWords) {
            el.forEach((word) => {
                word.el = dom({
                    selector: 'span',
                    styles: `${this._prefix}__word`
                });
                word.el.classList.add();
                if (!this._prop.appendLetters) {
                    word.el.innerHTML = word.content;
                }
            });
        }

        // add to stack
        this._el.words = el;

    }

    /**
     * @description Append words to the outer element.
     * @protected
     */
    _wordsAppend() {

        if (this._prop.appendWords) {
            this._el.words.forEach((obj) => {
                this._outer.appendChild(obj.el);
            });
        }

    }



    /**
     * @description Split text into letters.
     * @protected
     */
    _lettersSplit() {

        // get words
        let words = this._el.words;

        // in each word point out a letter
        words.forEach((word) => {
            
            // get chars
            let chars = word.children;

            // create letters
            let letters = [],
                i = 0;
            chars.forEach((char) => {

                // last element
                let last = i == chars.length - 1;

                // create object
                let letter = {
                    el: false,
                    content: char,
                    whitespace: last,
                    newline: !!(last && word.newline),
                    type: 'letter'
                };

                // create element
                if (this._prop.appendLetters) {
                    letter.el = dom({
                        selector: 'span',
                        styles: `${this._prefix}__letter`
                    });
                    letter.el.innerHTML = char;
                }

                // add to stack
                letters.push(letter);
                this._el.letters.push(letter);

                // iteration
                i++;

            });

            // change letters in words
            word.children = letters;

        });

    }

    /**
     * @description Append letters to the outer element.
     * @protected
     */
    _lettersAppend() {

        if (this._prop.appendLetters) {

            if (!this._prop.appendWords) {
                // if words are disabled, append to outer
                if (!this._prop.appendWords) {
                    this._el.letters.forEach((obj) => {
                        // append letters
                        this._outer.appendChild(obj.el);
                    });
                }
            }
            // append letters to words
            else {
                this._el.words.forEach((word) => {
                    word.children.forEach((letter) => {
                        word.el.appendChild(letter.el);
                    })
                });
            }

        }

    }



    /**
     * @description Append spaces between words & letters.
     * @protected
     */
    _appendSpaces() {

        let prop = this._prop,
            el = this._el;

        if (prop.appendWords) {
            this._appendSpacesType(el.words);
        }
        else if (prop.appendLetters) {
            this._appendSpacesType(el.letters);
        }

    }

    /**
     * @description Append spaces between elements.
     * @param {Array<Vevet.TextSplit.Letter>|Array<Vevet.TextSplit.Word>} el
     * @protected
     */
    _appendSpacesType(el) {

        el.forEach((obj) => {

            // append whitespace
            let whitespace = false;
            if (obj.type == 'word') {
                whitespace = true;
            }
            else {
                if (obj.whitespace) {
                    whitespace = true;
                }
            }
            if (whitespace) {
                whitespace = document.createTextNode("\x20");
                utils.insertAfter(whitespace, obj.el);
            }

            // append br
            if (obj.newline) {
                let br = dom({
                    selector: 'br'
                });
                utils.insertAfter(br, obj.el);
            }

        });

    }

    /**
     * @description Remove new lines (br tags).
     * @protected
     */
    _removeBr() {

        let br = this._outer.querySelectorAll("br");
        br.forEach(el => {
            el.remove();
        });

    }



    /**
     * @description Split text into lines.
     * @protected
     */
    _linesSplit() {

        let prop = this._prop;

        // get elements
        let el = [];
        if (prop.appendWords) {
            el = this._el.words;
        }
        else {
            if (prop.appendLetters) {
                el = this._el.letters;
            }
        }

        // vars
        let lines = [],
            line = [],
            offsetPrev = 0,
            newline = false;
            
        // go thru all elements and split them into lines
        for (let i = 0; i < el.length; i++) {

            // vars
            let obj = el[i];

            // compare offsets
            let offset = obj.el.offsetTop;
            if (offset !== offsetPrev) {
                newline = true;
            }
            else {
                newline = false;
            }
            offsetPrev = offset;

            // add new line to stack
            if (newline & line.length > 0) {
                lines.push(line);
                line = [];
            }
            // add to line
            line.push(obj);

        }
        // add last line
        lines.push(line);

        // create an array of lines
        let l = this._el.lines;

        // add lines to the array
        lines.forEach((line) => {

            let obj = {
                el: false,
                children: line,
                content: '',
                type: 'line'
            };

            // add content
            line.forEach((child) => {
                obj.content += child.content;
                if (child.type == 'word' || child.whitespace) {
                    obj.content += ' ';
                }
            });

            // create element
            if (prop.appendLines) {
                obj.el = dom({
                    selector: 'span',
                    styles: `${this._prefix}__line`
                });
            }

            // add to lines
            l.push(obj);

        });

    }

    /**
     * @description Append lines to the outer element.
     * @protected
     */
    _linesAppend() {

        // append lines
        if (this._prop.appendLines) {
            this._el.lines.forEach((line) => {

                // append line
                this._outer.appendChild(line.el);

                // appnd children
                line.children.forEach((child) => {
                    line.el.appendChild(child.el);
                });

            });
        }

    }

    /**
     * @description Remove lines from the outer element.
     * @protected
     */
    _linesRemove() {

        let prop = this._prop,
            el = this._el,
            outer = this._outer;

        if (prop.appendLines) {
            // move words
            if (prop.appendWords) {
                el.words.forEach((obj) => {
                    outer.appendChild(obj.el);
                });
            }
            else {
                // move letters
                if (prop.appendLetters) {
                    el.letters.forEach((obj) => {
                        outer.appendChild(obj.el);
                    });
                }
            }
        }

        // remove lines
        el.lines.forEach((obj) => {
            if (obj.el) {
                obj.el.remove();
            }
        });
        el.lines = [];

    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        this._outer.innerHTML = this._html;
        
    }



}