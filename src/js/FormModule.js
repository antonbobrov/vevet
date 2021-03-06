let toObject = require('form-to-object');

import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');

/**
 * @classdesc A class for creating an ajax form. <br>
 * Available targets:
 *  <ul>
 *      <li>success - If success. Argument - {@linkcode Vevet.AJAXEvent.CacheItem}</li>
 *      <li>failure - If failure. Argument - {@linkcode Vevet.AJAXEvent.ErrorCallback}</li>
 *  </ul>
 * <br><br> <b>import {FormModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.FormModule : success : Vevet.AJAXEvent.CacheItem}
 * @vevetModuleCallback { Vevet.FormModule : failure : Vevet.FormModule.ErrorCallback}
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class FormModule extends Module {


    
    /**
     * @memberof Vevet.FormModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors] - *** An object with css selectors.
     * @property {string|HTMLFormElement} [selectors.form=.vevet-form] - The form element.
     * @property {string} [selectors.error=.vevet-form__error] - The elements, in which errors will be displayed. For each element it is possible to create a div. It must contain the attribute "for" which is equal to the name of the input.
     * @property {string} [selectors.errors=.vevet-form__errors] - The element, in which all errors will be displayed.
     * 
     * @property {boolean} [addErrorClass=true] - True if you need to set error classes to elements.
     * @property {boolean} [addFilledClass=true] - True if you need to set the class "vevet-form__input_filled" when inputs are not empty.
     * @property {Array<string>} [filledExceptions=['', 'none']] - Values that will be thought to be "empty".
     * @property {boolean} [addFocusClass=true] - Add the class "vevet-form__input_focus" to inputs when they are focused.
     * @property {boolean} [clearAfterSuccess=true] - True if you need to reset values after the submit request is successful.
     * @property {boolean} [disabledSubmit=false] - True if you need to disable the submit button until all inputs are filled.
     *
     */
    /**
     * @alias Vevet.FormModule
     * 
     * @param {Vevet.FormModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}form`;
    }

    /**
     * @readonly
     * @type {Vevet.FormModule.Properties}
     */
    get defaultProp() {

        let prefix = this._prefix;
        
        return merge(super.defaultProp, {
            selectors: {
                form: `.${prefix}`,
                error: `.${prefix}__error`,
                errors: `.${prefix}__errors`
            },
            addErrorClass: true,
            addFilledClass: true,
            filledExceptions: ['', 'none'],
            addFocusClass: true,
            clearAfterSuccess: true,
            disabledSubmit: false
        });

    }

    /**
     * @member Vevet.FormModule#prop
     * @memberof Vevet.FormModule
     * @readonly
     * @type {Vevet.FormModule.Properties}
     */

    /**
     * @member Vevet.FormModule#_prop
     * @memberof Vevet.FormModule
     * @protected
     * @type {Vevet.FormModule.Properties}
     */

    /**
     * @function Vevet.FormModule#changeProp
     * @memberof Vevet.FormModule
     * @param {Vevet.FormModule.Properties} [prop]
     */



    /**
     * @description If an ajax request is in process.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get loading() {
        return this._loading;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description If loading at the moment.
         * @protected
         * @member {boolean}
         */
        this._loading = false;

        this._inputClass = `${this._prefix}__input`;
        this._filledClass = `${this._inputClass}_filled`;

        // get elements
        this._getElements();

    }

    /**
     * @description Get elements
     * @protected
     */
    _getElements() {
        
        /**
         * @description The form element.
         * @protected
         * @member {HTMLFormElement}
         */
        this._outer = selectEl.one(this._prop.selectors.form);
        let outer = this._outer;

        /**
         * @description Form inputs.
         * @protected
         * @member {NodeList}
         */
        this._el = outer.querySelectorAll('input:not([type="submit"]):not([type="button"]), select, textarea, keygen');
        
        // set filled class
        this._el.forEach(el => {
            this._classFilled(el);
        });
        
        /**
         * @description Error elements.
         * @protected
         * @member {NodeList}
         */
        this._errors = outer.querySelectorAll(this._prop.selectors.error);
        
        /**
         * @description Errors outer.
         * @protected
         * @member {HTMLElement}
         */
        this._errorsOuter = outer.querySelector(this._prop.selectors.errors);
        
        /**
         * @description Submit button.
         * @protected
         * @member {HTMLButtonElement|HTMLInputElement}
         */
        this._submit = outer.querySelector("input[type='submit'], button[type='submit']");

        // if submit is now disabled
        this._submitDisabled();

    }



    // Events
    _setEvents() {

        // events on elements
        this._el.forEach(el => {
            this.listener(el, 'focus', this._inputFocus.bind(this, el));
            this.listener(el, 'blur', this._inputBlur.bind(this, el));
            this.listener(el, 'keyup', this._inputKeyup.bind(this, el));
        });

        // submit event
        this.listener(this._outer, 'submit', this.submit.bind(this));

    }



    /**
     * @description Set classes if an input is not empty.
     * @param {HTMLElement} el 
     * @protected
     */
    _classFilled(el) {

        let parent = el.parentElement,
            filledClass = this._filledClass;

        if (parent.classList.contains(this._inputClass)) {
            if (this._filled(el)) {
                parent.classList.add(filledClass);
            }
            else{
                parent.classList.remove(filledClass);
            }
        }

    }



    /**
     * @description Check if an input is not empty.
     * @param {HTMLElement} el 
     * @protected
     */
    _filled(el) {

        let value = el.value,
            prop = this._prop;

        if (prop.filledExceptions.includes(value)) {
            return false;
        }
        else {
            if (prop.addFilledClass) {
                return true;
            }
        }
        return false;

    }

    /**
     * @description Check if all inputs are not empty.
     * @protected
     */
    _filledAll() {

        let count = 0;

        this._el.forEach(el => {
            if (this._filled(el)) {
                count++;
            }
        });

        if (count == this._el.length) {
            return true;
        }
        else {
            return false;
        }

    }



    /**
     * @description Disable submit if inputs are empty.
     * @protected
     */
    _submitDisabled() {

        let attr = "disabled";

        if (this._prop.disabledSubmit) {
            if (this._submit) {
                if (!this._filledAll()) {
                    this._submit.setAttribute(attr, attr);
                }
                else {
                    this._submit.removeAttribute(attr);
                }
            }
        }

    }



    /**
     * @description Element focus.
     * @param {HTMLElement} el 
     * @protected
     */
    _inputFocus(el) {

        let parent = el.parentElement;
        
        if (!this._prop.addFocusClass) {
            return;
        }

        if (parent.classList.contains(this._inputClass)) {
            parent.classList.add(`${this._inputClass}_focus`);
        }

    }

    /**
     * @description Element blur.
     * @param {HTMLElement} el 
     * @protected
     */
    _inputBlur(el) {

        let parent = el.parentElement;

        if (parent.classList.contains(this._inputClass)) {
            parent.classList.remove(`${this._inputClass}_focus`);
        }

        this._classFilled(el);

    }

    /**
     * @description Element keyup.
     * @protected
     */
    _inputKeyup() {

        // check if submit is still disabled
        this._submitDisabled();

    }



    /**
     * @description Submit form.
     * @param {object} [e=false] - Event data.
     * @returns {boolean} Return true if success.
     */
    submit(e = false) {
        
        // prevent default action
        if (e) {
            e.preventDefault();
        }

        // check if possible
        if (this._loading) {
            return false;
        }

        // object
        let obj = {},
            outer = this._outer;

        // get action
        obj.action = outer.action;

        // get method
        obj.method = outer.method;

        // get data
        obj.data = toObject(outer);

        // disable submit
        if (this._submit) {
            this._submit.disabled = true;
        }

        // change vars
        this._loading = true;

        // ajax request
        this._submitRequest(obj);

        // return
        return true;

    }

    /**
     * @description Ajax Request.
     * @param {object} obj 
     * @protected
     */
    _submitRequest(obj) {

        this._v.ajax.load({
            url: obj.action,
            method: obj.method,
            data: obj.data,
            success: (data) => {
                this._submitResponse(data);
            },
            abort: () => {
                this._submitRequest(obj);
            },
            error: () => {
                this._submitError();
            }
        });

    }

    /**
     * @description Request error.
     * @protected
     */
    _submitError() {
        throw new Error('Form Error');
    }

    /**
     * @description Request response.
     * @param {object} data
     * @protected
     */
    _submitResponse(data) {

        this._validResponse(data);

        // enable submit
        if (this._submit) {
            this._submit.disabled = false;
        }

        // change vars
        this._loading = false;

    }



    // Validators

    /**
     * @description Check if the form is valid.
     * @param {object} data 
     * @protected
     */
    _validResponse(data) {

        // get response
        let response = data.xhr.response,
            json;

        try {
           json = JSON.parse(response);
        }
        catch(e) {
           json = response;
        }

        // define what action
        if (json.success) {
            this._validSuccess(data);
        }
        else {
            this._validErrors(data, json);
        }

    }

    /**
     * @description Success validation.
     * @param {object} data 
     * @protected
     */
    _validSuccess(data) {

        // hide errors
        this._errorClasses();
        this._errorEl();

        // clear inputs
        if (this._prop.clearAfterSuccess) {
            this.clear();
        }

        // callback
        this.lbt("success", data);

    }

    /**
     * @memberof Vevet.FormModule
     * @typedef {object} ErrorCallback
     * @property {Vevet.AJAXEvent.CacheItem} data - Response data.
     * @property {Array<Vevet.FormModule.Error>} errors - Array of errors.
     */

    /**
     * @description Validate errors.
     * @param {object} data 
     * @param {object} json 
     * @protected
     */
    _validErrors(data, json) {

        let errors = [],
            allErrors = [];

        // errors

        if (json.errors) {

            // classes & error elements
            Object.keys(json.errors).forEach((key) => {
                let value = json.errors[key];
                // search overlappings in inputs
                this._el.forEach(el => { 
                    if (el.name == key) {
                        errors.push({
                            key: key, 
                            value: value
                        });
                    }
                });
                allErrors.push({
                    key: key, 
                    value: value
                });
            });

            // show errors
            this._errorClasses(errors, allErrors);
            this._errorEl(errors, allErrors);

        }

        // callback
        this.lbt("failure", {
            data: data,
            errors: errors
        });

    }



    /**
     * @memberof Vevet.FormModule
     * @typedef {object} Error
     * @property {string} key - Input name.
     * @property {string} value - Error message.
     */
    /**
     * @description Set errors in the form.
     * @protected
     * @param {Array<Vevet.FormModule.Error>} [array] - Array of errors for existing inputs.
     * @param {Array<Vevet.FormModule.Error>} [allErrors] - Array of all errors.
     */
    // eslint-disable-next-line no-unused-vars
    _errorClasses(array = [], allErrors = []) {

        if (!this._prop.addErrorClass) {
            return;
        }

        this._el.forEach(el => {

            let error = false,
                name = el.name,
                parent = el.parentElement;

            array.forEach(item => {
                if (name == item.key) {
                    error = true;
                }
            });

            // add classes
            let inputClass = this._inputClass;
            if (error) {
                el.classList.add("error");
                if (parent.classList.contains(inputClass)) {
                    parent.classList.add(`${inputClass}_error`);
                }
            }
            else {
                el.classList.remove("error");
                if (parent.classList.contains(inputClass)) {
                    parent.classList.remove(`${inputClass}_error`);
                }
            }   

        });

    }

    /**
     * @description Show errors.
     * @param {Array<object>} array 
     * @param {Array<object>} allErrors 
     * @protected
     */
    _errorEl(array = [], allErrors = []) {

        // elements
        this._errors.forEach(el => {

            let error = false,
                name = el.getAttribute("for");

            array.forEach(item => {
                if (name == item.key) {
                    error = true;
                    el.innerHTML = item.value;
                }
            });

            // add classes
            if (error) {
                el.classList.add("show");
            }
            else {
                el.classList.remove("show");
                el.innerHTML = '';
            }

        });

        // outer 
        if (this._errorsOuter) {
            if (allErrors.length > 0) {
                let html = '';
                allErrors.forEach(item => {
                    html += `<li>${item.value}</li>`;
                });
                this._errorsOuter.innerHTML = `
                    <ul>
                        ${html}
                    </ul>
                `;
                this._errorsOuter.classList.add("show");
            }
            else {
                this._errorsOuter.classList.remove("show");
            }
        }

    }



    /**
     * @description Clear all inputs except for hidden.
     */
    clear() {

        this._el.forEach(el => {
            if (el.type != 'hidden') {
                el.value = '';
                // reset classes
                let parent = el.parentElement;
                if (parent.classList.contains(this._inputClass)) {
                    parent.classList.remove(`${this._inputClass}_filled`);
                    parent.classList.remove(`${this._inputClass}_focus`);
                }
            }
        });

    }



}