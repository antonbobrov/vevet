const dom = require('dom-create-element');
import Module from './Module';
import merge from './merge';
import generateId from './generateId';
import timeoutCallback from './timeoutCallback';

/**
 * @classdesc Show your content in multi-level pop-up windows. Here there are several types of popups. <br>
 * Available targets:
 *  <ul>
 *      <li>created - when the popup is created. Argument - {@linkcode Vevet.PopupModule.CallbackCreate}</li>
 *      <li>show - when the popup is only being prepared to be shown.</li>
 *      <li>showLevel - a level will be shown.</li>
 *      <li>shownLevel - a level is shown.</li>
 *      <li>shown - when the popup is shown.</li>
 *      <li>hide - when the popup is only being prepared to be hidden.</li>
 *      <li>hideLevel - a level will be hidden.</li>
 *      <li>hiddenLevel - a level is hidden.</li>
 *      <li>hidden - when the popup is hidden.</li>
 *  </ul>
 * All other callbacks will receive {@linkcode Vevet.PopupModule.Callback} as an argument.
 * <br><br>
 * Supported types:
 *  <ul>
 *      <li>auto - auto height & width.</li>
 *      <li>modal - modal pop-up with definite sizes.</li>
 *      <li>media - 16:9 pop-up.</li>
 *      <li>content - full-screen popup.</li>
 *      <li>right - pop-up on the right.</li>
 *  </ul>
 * <br><br> <b>import {PopupModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.PopupModule : created : Vevet.PopupModule.CallbackCreate}
 * @vevetModuleCallback { Vevet.PopupModule : show : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : showLevel : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : shownLevel : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : shown : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : hide : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : hideLevel : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : hiddenLevel : Vevet.PopupModule.Callback}
 * @vevetModuleCallback { Vevet.PopupModule : hidden : Vevet.PopupModule.Callback}
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class PopupModule extends Module {


    
    /**
     * @memberof Vevet.PopupModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {number} [duration=750] - Animation duration. It is also set in SASS.
     * @property {string|'auto'|'modal'|'media'|'content'|'right'} [type='auto'] - Default type.
     * @property {number} [levels=3] - *** Maximum number of levels.
     * @property {boolean} [overlayHide=true] - Hide popup on overlay click.
     * @property {string} [selectorHideButton=.v-popup__hide] - Selector for elements which can close the popup.
     *
     */
    /**
     * @alias Vevet.PopupModule
     * 
     * @param {Vevet.PopupModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}popup`;
    }

    /**
     * @readonly
     * @type {Vevet.PopupModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            duration: 750,
            type: 'auto',
            levels: 3,
            overlayHide: true,
            selectorHideButton: '.v-popup__hide'
        });

    }

    /**
     * @member Vevet.PopupModule#prop
     * @memberof Vevet.PopupModule
     * @readonly
     * @type {Vevet.PopupModule.Properties}
     */

    /**
     * @member Vevet.PopupModule#_prop
     * @memberof Vevet.PopupModule
     * @protected
     * @type {Vevet.PopupModule.Properties}
     */

    /**
     * @function Vevet.PopupModule#changeProp
     * @memberof Vevet.PopupModule
     * @param {Vevet.PopupModule.Properties} [prop]
     */



    /**
     * @description If the window is already created.
     * @readonly
     * @member {boolean}
     */
    get created() {
        return this._created;
    }
    /**
     * @description If the window is shown.
     * @readonly
     * @member {boolean}
     */
    get shown() {
        return this._shown;
    }
    /**
     * @description Current level number.
     * @readonly
     * @default -1
     * @member {number}
     */
    get level() {
        return this._levelActive;
    }
    /**
     * @description If animation in process.
     * @readonly
     * @member {boolean}
     */
    get animating() {
        return this._animating;
    }
    
    /**
     * @description Popup outer. False if not created.
     * @readonly
     * @member {HTMLElement|false}
     */
    get outer() {
        return this._outer;
    }
    /**
     * @description Popup overlay outer. False if not created.
     * @readonly
     * @member {HTMLElement|false}
     */
    get overlay() {
        return this._overlay;
    }
    /**
     * @description Popup container outer. False if not created.
     * @readonly
     * @member {HTMLElement|false}
     */
    get container() {
        return this._container;
    }
    /**
     * @description Popup levels outer. False if not created.
     * @readonly
     * @member {HTMLElement|false}
     */
    get levelsOuter() {
        return this._levelsOuter;
    }
    /**
     * @description Popup close button. False if not created.
     * @readonly
     * @member {HTMLElement|false}
     */
    get closeButton() {
        return this._close;
    }



    // Extra constructor
    _extra() {

        super._extra();

        /**
         * @description If the popup is created.
         * @protected
         * @member {boolean}
         */
        this._created = false;
        /**
         * @description If the popup is animating.
         * @protected
         * @member {boolean}
         */
        this._animating = false;
        /**
         * @description If the popup is shown.
         * @protected
         * @member {boolean}
         */
        this._shown = false;
        /**
         * @description Popup ID.
         * @protected
         * @member {string}
         */
        this._id = generateId(this._prefix);
        /**
         * @description Popup current types.
         * @protected
         * @member {Array<string|'auto'|'modal'|'media'|'content'|'right'>}
         */
        this._types = [];

        /**
         * @protected
         * @member {HTMLElement}
         */
        this._outer;
        /**
         * @protected
         * @member {HTMLElement}
         */
        this._overlay;
        /**
         * @protected
         * @member {HTMLElement}
         */
        this._container;
        /**
         * @protected
         * @member {HTMLElement}
         */
        this._levelsOuter;
        /**
         * @protected
         * @member {HTMLElement}
         */
        this._close;

        /**
         * @description Current level number.
         * @protected
         * @member {number}
         */
        this._levelActive = -1;
        /**
         * @description Levels.
         * @protected
         * @member {Array<Vevet.PopupModule.Level>}
         */
        this._levels = [];

    }

    /**
     * @memberof Vevet.PopupModule
     * @typedef Level
     * 
     * @property {HTMLElement} outer
     * @property {Array<Vevet.BindListener>} listeners
     * @property {boolean} shown
     * @property {number} num
     * @property {boolean} append
     * @property {HTMLElement|false} source
     * @property {Array<string|'auto'|'modal'|'media'|'content'|'right'>} types
     */


    /**
     * @description Show popup.
     * @param {Vevet.PopupModule.ShowConfig} [data] - Pop-up config.
     * @returns {boolean} Returns tru if success.
     */
    show(data) {

        data = merge(this._showConfig(), data);

        // timeout
        let timeout = 25;

        // if animating
        if (this._animating) {
            return false;
        }

        // create pop-up window if it was not yet created
        if (!this._created) {
            this._create();
            timeout = 25;
        }

        // get next level and return false if max number exceeded
        let num = this.getNextLevel();
        if (typeof num == 'boolean' & !num) {
            return false;
        }

        // show level
        let result = this._showLevel(num, data);
        if (!result) {
            return false;
        }

        // change vars
        this._animating = true;
        this._shown = true;

        // add types
        if (num === 0) {
            this._types = data.types;
            data.types.forEach(type => {
                this._outer.classList.add(`${this._prefix}_${type}`);
            });
        }

        // no transition
        this._outer.classList.add(`${this._prefix}_no-transition`);

        // actions

        setTimeout(() => {

            // no transition
            this._outer.classList.remove(`${this._prefix}_no-transition`);

            // first show
            if (num === 0) {
                this.lbt("show", this._argument(num));
                // add classes
                this._outer.classList.add(`${this._prefix}_show`);
            }

            // add classes to level
            this._levelClasses(num);

            // callbacks level
            this.lbt("showLevel", this._argument(num));

            // callbacks shown & vars
            setTimeout(() => {
                this._animating = false;
                if (num === 0) {
                    this.lbt("shown", this._argument(num));
                }
                this.lbt("shownLevel", this._argument(num));
            }, this._prop.duration);

        }, timeout);

        return true;
        
    }

    /**
     * @description Show popup.
     * @param {number} num - Level number.
     * @param {Vevet.PopupModule.ShowConfig} data - Pop-up config.
     * @returns {boolean} Returns true if success.
     * @protected
     */
    _showLevel(num, data) {

        let level = this._levels[num];

        // get element
        let el = false;
        if (data.el) {
            el = data.el;
        }
        else {
            el = document.querySelector(data.selector);
            if (el == null) {
                return false;
            }
        }

        // insert html
        if (data.append) {
            while (el.childNodes.length > 0) {
                level.outer.appendChild(el.childNodes[0]);
            }
        }
        else {
            level.outer.innerHTML = el.innerHTML;
        }

        // change config
        level.shown = true;
        level.append = data.append;
        level.source = el;
        level.types = data.types;

        // change active level
        this._levelActive = num;

        // events for hide
        let hides = level.outer.querySelectorAll(this._prop.selectorHideButton);
        hides.forEach(hideEl => {
            let id = this.listener(hideEl, 'click', (e) => {
                e.preventDefault();
                this.hide();
            });
            level.listeners.push(id);
        });
        

        // return success
        return true;

    }

    /**
     * @description Set classes accorging to the level number.
     * @param {number} num - Level number.
     * @protected
     */
    _levelClasses(num) {

        let levels = this._levels,
            outer = this._outer,
            prefix = this._prefix,
            className = `${prefix}__level`,
            classNameActive = `${className}_active`,
            outerClass = `${prefix}_level`;

        levels.forEach(level => {
            if (level.num === num || level.num === -1) {
                level.outer.classList.add(classNameActive);
            }
            else {
                level.outer.classList.remove(classNameActive);
            }
        });

        levels.forEach(level => {
            if (level.num === num) {
                outer.classList.add(`${outerClass}-${level.num}`);
            }
            else {
                outer.classList.remove(`${outerClass}-${level.num}`);
            }
        });
        
    }

    

    /**
     * @description Check if it's possible to hide the popup.
     */
    checkHide() {

        // if animating
        if (this._animating) {
            return false;
        }
        // if not created
        if (!this._created) {
            return false;
        }
        // if not shown
        if (!this._shown) {
            return false;
        }

        return true;

    }

    /**
     * @description Hide all levels at once.
     * @returns {boolean} Returns true if success.
     */
    hideAll() {

        // if possible to hide
        if (!this.checkHide()) {
            return false;
        }

        // get current duration
        const duration = this._prop.duration;

        // change duration to zero
        // if the active level is not the first one
        if (this._levelActive > 0) {
            this._prop.duration = 0;
            // an now hide all the levels except for the first one
            for (let i = this._levelActive; i > 0; i--) {
                this.hide();
            }
            // then restore duration and hide the first level
            this._prop.duration = duration;
        }

        // hide the first level
        this.hide();

        // return success
        return true;

    }

    /**
     * @description Hide current level.
     * @returns {boolean} Returns true if success.
     */
    hide() {

        // if possible to hide
        if (!this.checkHide()) {
            return false;
        }

        // change vars
        this._animating = true;

        // hide callback
        if (this._levelActive === 0) {
            this.lbt("hide", this._argument(this._levelActive));
            // remove classes
            this._outer.classList.remove(`${this._prefix}_show`);
        }

        // hide current level & change vars
        this._hideLevel(this._levelActive, () => {
            this._animating = false;
            if (this._levelActive === -1) {
                // change vars
                this._shown = false;
                // remove types
                this._types.forEach(type => {
                    this._outer.classList.remove(`${this._prefix}_${type}`);
                });
            }
        });

        // return success
        return true;

    }

    /**
     * @description Hide a pop-up level.
     * @param {number} num - Level number.
     * @param {Function} callback 
     * @protected
     */
    _hideLevel(num, callback = () => {}) {

        // get current level
        let level = this._levels[num];

        // hide level callback
        this.lbt("hideLevel", this._argument(num));

        // get previous level
        let prev = this.getPrevLevel();

        // change current level
        this._levelActive = prev;

        // remove current level classes
        this._levelClasses(prev);

        // change config
        level.shown = false;

        // some actiones when the level is hidden
        timeoutCallback(() => {

            // move innerHTML back to its owner
            if (level.append) {
                while (level.outer.childNodes.length > 0) {
                    level.source.appendChild(level.outer.childNodes[0]);
                }
            }
            else {
                level.outer.innerHTML = '';
            }

            // remove listeners
            level.listeners.forEach(listener => {
                this.removeEventListener(listener);
            });
            level.listeners = [];

            // callback
            callback();

            // hidden level callback
            this.lbt("hiddenLevel", this._argument(num));

            // hidden popup callback
            if (this._levelActive === -1) {
                this.lbt("hidden", this._argument(num));
            }

        }, this._prop.duration);

    }



    // Configs & helpers

    /**
     * @memberof Vevet.PopupModule
     * @typedef {object} ShowConfig
     * 
     * @property {HTMLElement} [el=false] - The DOM element which innerHTML will be taken and inserted into the pop-up window.
     * @property {string} [selector=.popup] - Selector of the element.
     * @property {Array<string>} [append=false] - If true, all children from the source element will be appended to the pop-up window.
     * If false, innerHTML will be copied and inserted.
     * @property {Array<string|'auto'|'modal'|'media'|'content'|'right'>} [types] - The default value is taken from {@linkcode Vevet.PopupModule.Properties}.
     */

    /**
     * @description Get default show configuration.
     * @protected
     * @returns {Vevet.PopupModule.ShowConfig} Returns an object.
     */
    _showConfig() {
        return {
            el: false,
            selector: '.popup',
            append: false,
            types: [this._prop.type]
        };
    }
    
    /**
     * @description Get previous level number.
     * @returns {number} Returns a number.
     */
    getPrevLevel(){

        let prev = this._levelActive - 1;

        return prev;

    }
    
    /**
     * @description Get next level number.
     * @returns {number} Returns a number.
     */
    getNextLevel(){

        let next = this._levelActive + 1;
        if (next > this._prop.levels - 1) {
            return false;
        }

        return next;

    }



    /**
     * @description Show pop-up
     * @protected
     */
    _create() {

        // get prefix
        let prefix = this._prefix,
            domSelector = 'div';

        // outer
        this._outer = dom({
            selector: domSelector,
            id: this._id,
            styles: `${prefix} ${prefix}_levels-${this._prop.levels}`
        });
        this._v.body.appendChild(this._outer);
        
        // overlay
        this._overlay = dom({
            selector: domSelector,
            styles: `${prefix}__overlay`
        });
        this._outer.appendChild(this._overlay);
        
        // container
        this._container = dom({
            selector: domSelector,
            styles: `${prefix}__container`
        });
        this._outer.appendChild(this._container);
        
        // close
        this._close = dom({
            selector: domSelector,
            styles: `${prefix}__close`
        });
        this._container.appendChild(this._close);
        
        // levels outer
        this._levelsOuter = dom({
            selector: domSelector,
            styles: `${prefix}__levels`
        });
        this._container.appendChild(this._levelsOuter);

        // create levels
        this._createLevels();

        // change vars
        this._created = true;

        // set events
        this._createEvents();

        // callback
        this.lbt("created", this._argumentCreate());

    }

    /**
     * @description Create pop-up levels.
     * @protected
     */
    _createLevels() {

        for (let i = 0; i < this._prop.levels; i++) {
            this._createLevel(i);
        }

    }

    /**
     * @description Create a pop-up level.
     * @param {number} num - Pop-up level order number.
     * @protected
     */
    _createLevel(num) {

        let obj = {};

        // get prefix
        let prefix = this._prefix,
            className = `${prefix}__level`;

        // create outer
        obj.outer = dom({
            selector: 'div',
            styles: `${className} ${className}-${num}`
        });
        this._levelsOuter.appendChild(obj.outer);

        // event listeners
        obj.listeners = [];

        // if opened
        obj.shown = false;

        // config
        obj.num = num;
        obj.append = false;
        obj.source = false;
        obj.types = [];

        // add to stack
        this._levels.push(obj);

    }

    /**
     * @description Set pop-up event listeners.
     * @protected
     */
    _createEvents() {

        // overlay
        this.addEventListener({
            target: 'click',
            el: this._overlay,
            do: (e) => {
                if (this._prop.overlayHide) {
                    e.preventDefault();
                    this.hide();
                }
            }
        });

        // close
        this.addEventListener({
            target: 'click',
            el: this._close,
            do: (e) => {
                e.preventDefault();
                this.hide();
            }
        })

    }



    /**
     * @memberof Vevet.PopupModule
     * @typedef {object} CallbackCreate
     * 
     * @property {HTMLElement} outer - Pop-up window outer.
     * @property {HTMLElement} overlay - Pop-up window overlay.
     * @property {HTMLElement} container - Pop-up window container.
     * @property {HTMLElement} levelsOuter - Pop-up window levels' outer.
     */

    /**
     * @description Get callback argument for 'create'.
     * @protected
     * @returns {Vevet.PopupModule.CallbackCreate} Returns an object.
     */
    _argumentCreate() {
        return {
            outer: this._outer,
            overlay: this._overlay,
            container: this._container,
            levelsOuter: this._levelsOuter,
        }
    }

    /**
     * @memberof Vevet.PopupModule
     * @typedef {object} Callback
     * 
     * @property {number} level - The order number of the level under action.
     */

    /**
     * @description Get callback argument for other events.
     * @param {number} num - Level number.
     * @protected
     * @returns {Vevet.PopupModule.Callback} Returns an object.
     */
    _argument(num) {
        return {
            level: num
        }
    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        // remove elements

        if (this._created) {
            
            // remove outer
            this._outer.remove();

        }
        
    }



}