const dom = require('dom-create-element');
import Module from './Module';
import merge from './merge';
import domChildOf from './domChildOf';
const selectEl = require('select-el');

/**
 * @classdesc A class for cretating a custom select element. <br>
 * Available targets:
 *  <ul>
 *      <li>open</li>
 *      <li>opened</li>
 *      <li>close</li>
 *      <li>closed</li>
 *      <li>change</li>
 *  </ul>
 * Each callback receives {@linkcode Vevet.SelectModule.Callback} as an argument.
 * <br><br> <b>import {SelectModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.SelectModule : open : Vevet.SelectModule.Callback}
 * @vevetModuleCallback { Vevet.SelectModule : opened : Vevet.SelectModule.Callback}
 * @vevetModuleCallback { Vevet.SelectModule : close : Vevet.SelectModule.Callback}
 * @vevetModuleCallback { Vevet.SelectModule : closed : Vevet.SelectModule.Callback}
 * @vevetModuleCallback { Vevet.SelectModule : change : Vevet.SelectModule.Callback}
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class SelectModule extends Module {


    
    /**
     * @memberof Vevet.SelectModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLSelectElement} [selector=vevet-select] - *** Selector of a "select" element.
     * @property {boolean} [showSelected=true] - Set true if you want to display the selected option in the selector.
     * @property {boolean} [changePlaceholder=true] - Defines if you need to change the text in the head of the selector.
     * @property {number} [duration=250] - Duration of animation when showing and hiding.
     * 
     * @property {object} [search] - Search settings.
     * @property {boolean} [search.on=false] - Enable search.
     * @property {string} [search.placeholder=Type to search] - *** Placeholder of the search input.
     * 
     * @property {object} [close] - When to close the selectbox.
     * @property {boolean} [close.change=true] - Close on change.
     * @property {boolean} [close.out=true] - Close on click on any element except for the selector.
     */
    /**
     * @alias Vevet.SelectModule
     * 
     * @param {Vevet.SelectModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}select`;
    }

    /**
     * @readonly
     * @type {Vevet.SelectModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            selector: `.${this._prefix}`,
            showSelected: true,
            changePlaceholder: true,
            duration: 250,
            search: {
                on: false,
                placeholder: 'Type to search'
            },
            close: {
                change: true,
                out: true
            }
        });

    }

    /**
     * @member Vevet.SelectModule#prop
     * @memberof Vevet.SelectModule
     * @readonly
     * @type {Vevet.SelectModule.Properties}
     */

    /**
     * @member Vevet.SelectModule#_prop
     * @memberof Vevet.SelectModule
     * @protected
     * @type {Vevet.SelectModule.Properties}
     */

    /**
     * @function Vevet.SelectModule#changeProp
     * @memberof Vevet.SelectModule
     * @param {Vevet.SelectModule.Properties} [prop]
     */



    /**
     * @description Select element.
     * @readonly
     * @type {HTMLSelectElement}
     */
    get select() {
        return this._select;
    }
    /**
     * @description Options.
     * @readonly
     * @type {Array<HTMLOptionElement>}
     */
    get options() {
        return this._options;
    }
    /**
     * @description If the element is opened.
     * @readonly
     * @type {boolean}
     */
    get opened() {
        return this._opened;
    }
    /**
     * @description If the select element is multiple.
     * @readonly
     * @type {boolean}
     */
    get multiple() {
        return this._multiple;
    }
    /**
     * @description If the animation is in process.
     * @readonly
     * @type {boolean}
     */
    get animating() {
        return this._animating;
    }
    /**
     * @description The order number/numbers (for multiple) of options or false if none are selected.
     * @readonly
     * @type {number|Array<number>|false}
     */
    get active() {
        if (this._actives.length > 1) {
            return this._actives;
        }
        else {
            if (this._actives.length > 0) {
                return this._actives[0];
            }
            else {
                return false;
            }
        }
    }
    /**
     * @description Returns the value/values (for multiple) of the select or false if none are selected.
     * @readonly
     * @type {string|Array<string>|false}
     */
    get value() {
        let values = this._getValues();
        if (values.length > 1) {
            return values;
        }
        else {
            if (values.length > 0) {
                return values[0];
            }
            else {
                return false;
            }
        }
    }

    /**
     * @memberof Vevet.SelectModule
     * @typedef {object} Callback
     * @property {number|Array<number>|false} active - The order number/numbers (for multiple) of options or false if none are selected.
     * @property {string|Array<string>|false} value - Returns the value/values (for multiple) of the select or false if none are selected.
     * @property {Array<HTMLOptionElement>} [options] -  Options.
     * @property {HTMLSelectElement} select - Select element.
     * @property {HTMLElement} outer - Outer element.
     */
    /**
     * @description Get callback data.
     * @returns {Vevet.SelectModule.Callback} Returns callback data.
     */
    _callbackData() {

        let obj = {
            active: this.active,
            value: this.value,
            options: this._options,
            select: this._select,
            outer: this._outer
        };

        return obj;

    }



    // Extra constructor
    _extra() {

        super._extra();

        /**
         * @description If multiple.
         * @protected
         * @member {boolean}
         */
        this._multiple = false;
        /**
         * @description If opened.
         * @protected
         * @member {boolean}
         */
        this._opened = false;
        /**
         * @description If animating.
         * @protected
         * @member {boolean}
         */
        this._animating = false;
        /**
         * @description Active options numbers.
         * @protected
         * @member {Array<number>}
         */
        this._actives = [];

        /**
         * @description List elements.
         * @protected
         * @member {HTMLLIElement}
         */
        this._li = [];

        // get & create elements
        this._elementsGet();
        this._elementsCreate();

        // set classes
        this._setClasses();

    }

    // When properties are changed
    _changeProp(prop) {
        super._changeProp(prop);
        this._setClasses();
    }



    /**
     * @description Set classes.
     * @protected
     */
    _setClasses() {

        let prop = this._prop,
            prefix = this._prefix,
            classNameSearch = `${prefix}__search_hide`,
            classNameValues = `${prefix}__values_hide-active`;

        // search
        if (!prop.search.on) {
            this._search.classList.add(classNameSearch);
        }
        else {
            this._search.classList.remove(classNameSearch);
        }

        // selected
        if (!prop.showSelected) {
            this._values.classList.add(classNameValues);
        }
        else {
            this._values.classList.remove(classNameValues);
        }

    }



    /**
     * @description Get elements.
     * @protected
     */
    _elementsGet() {

        /**
         * @description Select element.
         * @protected
         * @member {HTMLSelectElement}
         */
        this._select = selectEl.one(this._prop.selector);
        this._select.style.display = 'none';

        // multiple
        if (this._select.multiple) {
            this._multiple = true;
        }

        /**
         * @description Options.
         * @protected
         * @member {Array<HTMLOptionElement>}
         */
        this._options = this._select.querySelectorAll("option");

        /**
         * @description Parent element of the select element.
         * @protected
         * @member {HTMLElement}
         */
        this._parent = this._select.parentElement;

    }

    /**
     * @description Create elements.
     * @protected
     */
    _elementsCreate() {

        // get prefix
        let prefix = this._prefix,
            domSelector = 'div';

        /**
         * @description Outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = dom({
            selector: domSelector,
            styles: `${prefix}`
        });
        this._parent.insertBefore(this._outer, this._select);

        /**
         * @description Placeholder outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._placeholder = dom({
            selector: domSelector,
            styles: `${prefix}__placeholder`
        });
        this._outer.appendChild(this._placeholder);
        
        /**
         * @description Container element.
         * @protected
         * @member {HTMLElement}
         */
        this._container = dom({
            selector: domSelector,
            styles: `${prefix}__container`
        });
        this._outer.appendChild(this._container);
        
        /**
         * @description Content element.
         * @protected
         * @member {HTMLElement}
         */
        this._content = dom({
            selector: domSelector,
            styles: `${prefix}__content`
        });
        this._container.appendChild(this._content);
        
        /**
         * @description Search outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._search = dom({
            selector: domSelector,
            styles: `${prefix}__search`
        });
        this._content.appendChild(this._search);
        
        /**
         * @description Search input element.
         * @protected
         * @member {HTMLInputElement}
         */
        this._input = dom({
            selector: 'input',
            attr: {
                type: "text",
                placeholder: this._prop.search.placeholder
            },
            styles: `${prefix}__input`
        });
        this._search.appendChild(this._input);
        
        /**
         * @description UL element.
         * @protected
         * @member {HTMLUListElement}
         */
        this._values = dom({
            selector: 'ul',
            styles: `${prefix}__values`
        });
        this._content.appendChild(this._values);

        // li
		for (let i = 0; i < this._options.length; i++) {

            // get option
            let option = this._options[i],
                text = option.innerHTML;

            // create li
            let li = dom({
                selector: 'li',
                styles: `${prefix}__value`
            });
            li.innerHTML = text;

            // if selected
            if (option.selected) {
                li.classList.add(`${prefix}__value_active`);
                this._actives.push(i);
            }
            
            // push to stack
            this._li.push(li);
            this._values.appendChild(li);

        }

        // change actives
        if (this._actives.length === 0 & this._options.length > 0) {
            this._options[0].selected = true;
            this._actives = [0];
        }
        this._change(false);

    }



    // Set events
    _setEvents() {
        
        // toggle on placeholder
        this._placeholder.addEventListener("click", () => {
            this.toggle();
        });
        
        // change on li click
		for (let i = 0; i < this._li.length; i++) {
            this._li[i].addEventListener("click", () => {
                this._changeValue(i);
            });
        }

        // hide
        this.listener(window, 'click', this._windowClick.bind(this));
        
        // change select
        this.listener(this._select, 'change', this._changeSelect.bind(this));
        
        // search
        this._input.addEventListener("keyup", () => {
            this._searchKeyup();
        });

    }

    /**
     * @description Outer click on window.
     * @param {object} e
     * @protected
     */
    _windowClick(e) {
        if (!domChildOf(e.target, this._outer) & this._opened & this._prop.close.out) {
            this.close();
        }
    }

    /**
     * @description Key-up in search.
     * @protected
     */
    _searchKeyup() {

        // check if search is enabled
        if (!this._prop.search.on) {
            return;
        }

        let className = `${this._prefix}__value_hide`;

        // get search value
        let value = this._input.value;

        // do searching
        if (value.length === 0) {
            this._li.forEach(el => {
                el.classList.remove(className);
            });
        }
        else{
            this._li.forEach(el => {
                // get inner text & compare
                let text = el.innerText.toLowerCase();
                if (text.includes(value.toLowerCase())) {
                    el.classList.remove(className);
                }
                else{
                    el.classList.add(className);
                }
            });
        }

    }


    /**
     * @description Reset searching.
     * @protected
     */
    _searchReset() {

        this._input.value = '';
        this._searchKeyup();

    }



    /**
     * @description Get values.
     * @protected
     */
    _getValues() {

        let values = [];
        
        for (let i = 0; i < this._options.length; i++) {
            if (this._actives.includes(i)) {
                values.push(this._options[i].value);
            }
        }

        return values;

    }

    /**
     * @description Get texts.
     * @protected
     */
    _getTexts() {

        let texts = [];
        
        for (let i = 0; i < this._options.length; i++) {
            if (this._actives.includes(i)) {
                texts.push(this._options[i].innerText);
            }
        }

        return texts;

    }



    /**
     * @description Change values.
     * @protected
     * @param {boolean} [event=true] - Defines if you need to launch callbacks.
     */
    _change(event = true) {

        let prefix = this._prefix,
            className = `${prefix}__value_active`;

        // change placeholder
        if (this._prop.changePlaceholder) {
            this._placeholder.innerHTML = `<span>${this._getTexts().join(", ")}</span> <div class="${prefix}__arrow"></div>`;
        }

        // change value classes
        for (let i = 0; i < this._li.length; i++) {
            let li = this._li[i];
            if (this._actives.includes(i)) {
                li.classList.add(className);
            }
            else {
                li.classList.remove(className);
            }
        }

        if (event) {
            this.lbt("change", this._callbackData());
        }

    }

    /**
     * @description Change on value click.
     * @protected
     * @param {number} num - The order number of a value li.
     */
    _changeValue(num) {

        // get option
        let option = this._options[num];

        // set or reset
        if (this._multiple) {
            if (option.selected) {
                option.selected = false;
            }
            else {
                option.selected = true;
            }
        }
        else {
            option.selected = true;
        }

        // change select
        this._select.dispatchEvent(new Event('change'));

        // close
        if (this._prop.close.change) {
            this.close();
        }

    }

    /**
     * @description Change on select change.
     * @protected
     */
    _changeSelect() {

        // get current value
        let actives = [],
            i = 0;
        this._options.forEach(el => {
            if (el.selected) {
                actives.push(i);
            }
            i++;
        });

        // change vars
        this._actives = actives;

        // change
        this._change();

    }
    


    /**
     * @description Show/Hide the selectbox.
     * @returns {boolean} Returns true if success.
     */
    toggle() {

        if (this._animating) {
            return false;
        }

        if (this._opened) {
            this.close();
        }
        else {
            this.open();
        }

        return true;

    }

    /**
     * @description Open the select box.
     * @returns {boolean} Returns true if success.
     */
    open() {
        
        if (this._opened || this._animating) {
            return false;
        }

        let prefix = this._prefix;

        // reset search
        this._searchReset();

        // change vars
        this._opened = true;
        this._animating = true;

        // show select
        this._outer.classList.add(`${prefix}_opened`);
        this._container.classList.add(`${prefix}__container_opened`);
        setTimeout(() => {
            this._outer.classList.add(`${prefix}_animate`);
            this._container.classList.add(`${prefix}__container_animate`);
            this.lbt("open", this._callbackData());
            setTimeout(() => {
                this._animating = false;
                this.lbt("opened", this._callbackData());
            }, this._prop.duration)
        }, 15);

        return true;

    }

    /**
     * @description Close the select box.
     * @returns {boolean} Returns true if success.
     */
    close() {
        
        if (!this._opened || this._animating) {
            return false;
        }

        // change vars
        this._opened = false;
        this._animating = true;

        let prefix = this._prefix;

        // hide select
        this._outer.classList.remove(`${prefix}_animate`);
        this._container.classList.remove(`${prefix}__container_animate`);
        this.lbt("close", this._callbackData());
        setTimeout(() => {
            this._outer.classList.remove(`${prefix}_opened`);
            this._container.classList.remove(`${prefix}__container_opened`);
            this._animating = false;
            this.lbt("closed", this._callbackData());
        }, this._prop.duration);

        return true;

    }



    /**
     * @description Destroy the select.
     */
    destroy() {

        super.destroy();

        // remove element
        this._outer.remove();

        // display select
        this._select.style.display = '';
        
    }



}