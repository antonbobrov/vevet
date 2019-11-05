import utils from '../../core/utils';
import Module from '../Module';

/**
 * @classdesc A class for creating a menu that opens in a popup. <br>
 * Available targets:
 *  <ul>
 *      <li>show - when the menu is being opened.</li>
 *      <li>shown - when the menu is opened, the process of animation has ended.</li>
 *      <li>innerShow - when the menu is opened and inner animation started.</li>
 *      <li>innerShown - when the menu is opened and inner animation ended.</li>
 *      <li>hide - when the menu is being hidden.</li> 
 *      <li>innerHide - when the menu is being hidden and inner animation starts.</li>
 *      <li>innerHidden - when the menu is being hidden and inner animation ends.</li>
 *      <li>hidden - when the menu is hidden and the animation has ended.</li>
 *  </ul>
 * <br><br> <b>import {Menu} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Menu extends Module {


    
    /**
     * @memberof Vevet.Menu
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {boolean} [events=true] - Defines if events are active: click on the menu button.
     * 
     * @property {object} [selectors] - ***
     * @property {string|HTMLElement} [selectors.outer=.vevet-menu] -  The outer of the menu.
     * @property {string|HTMLElement} [selectors.button=.vevet-menu-button] - The button that opens the menu.
     * 
     * @property {object} [animation] - An object with animation information.
     * @property {number} [animation.duration=750] - The duration of animation of the outer when it is being shown or hidden.
     * @property {number} [animation.button=750] - If you need to animate the button when menu is shown, set the value that is equal to the duration of animation of the menu button.
     * @property {number} [animation.inner=0] - The inner duration of the menu. F.e., if you need to animate links before closing the menu.
     * @property {number} [animation.innerShiftShow=1] - Shift of inner animation before showing. It mean that inner animation will start after (1 * animation.duration) since the button was pushed.
     * @property {number} [animation.innerShiftHide=1] - Shift of inner animation before hiding. It mean that inner animation will start after (1 * animation.inner) since the button was pushed.
     * 
     * @property {object} [delays] - An object with delays information.
     * @property {number} [delays.show=0] - Delay before the menu starts opening.
     * @property {number} [delays.hide=0] - Delay before the menu starts closing.
     */
    /**
     * @alias Vevet.Menu
     * 
     * @param {Vevet.Menu.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}menu`;
    }

    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            events: true,
            selectors: {
                outer: `.${this._prefix}`,
                button: `.${this._prefix}-button`
            },
            animation: {
                duration: 500,
                button: 500,
                inner: 0,
                innerShiftShow: 1,
                innerShiftHide: 1
            },
            delays: {
                show: 0,
                hide: 0
            }
        });

    }



    /**
     * @description If the menu is opening or closing.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get animating() {
        return this._animating;
    }
    /**
     * @description If menu is shown.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get shown() {
        return this._shown;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        // variables
        this._shown = false;
        this._animating = false;

        // get elements
        this._getElements();

    }

    /**
     * @description Get elements.
     * @private
     */
    _getElements() {

        let selectors = this._prop.selectors;
        
        this._outer = utils.element(selectors.outer);
        this._button = utils.element(selectors.button);

    }



    // Set listeners on elements.
    _setEvents() {

        super._setEvents();

        // button click
        this.listener(this._button, 'click', this._buttonClick.bind(this));

    }

    /**
     * @description Click on button.
     * @private
     * @param {object} e
     */
    _buttonClick(e) {

        if (this._prop.events) {
            e.preventDefault();
            this.toggle();
        }

    }



    /**
     * @description Show menu.
     * @returns {boolean} Returns true if menu can be opened.
     */
    show() {

        if (this._shown) {
            return false;
        }

        return this.toggle();
        
    }

    /**
     * @description Hide menu.
     * @returns {boolean} Returns true if menu can be closed.
     */
    hide() {

        if (!this._shown) {
            return false;
        }

        return this.toggle();
        
    }

    /**
     * @description Show/Hide menu.
     * @returns {boolean} Returns true if menu can be opened or closed.
     */
    toggle() {

        let delays = this._prop.delays;

        // check if animating
        if(this._animating){
            return false;
        }
        this._animating = true;

        // hide menu
        
        if (this._shown) {
            this.lbt("hide");
            let delay = delays.hide;
            if (delay === 0) {
                this._hide();
            }
            else {
                setTimeout(this._hide.bind(this), delay);
            }
        }

        // show menu

        else {
            this.lbt("show");
            let delay = delays.show;
            if (delay === 0) {
                this._show();
            }
            else {
                setTimeout(this._show.bind(this), delay);
            }
        }

        return true;
        
    }

    /**
     * @description Show menu.
     * @private
     */
    _show() {

        // vars
        let outer = this._outer,
            prefix = this._prefix,
            animation = this._prop.animation;

        // set classes
        outer.classList.add(`${prefix}_show`);
        outer.classList.add(`${prefix}_showing`);
        this._button.classList.add(`${prefix}-button_close`);

        // change vars
        setTimeout(() => {
            this._shown = true;
        }, animation.duration);

        // show inner
        setTimeout(() => {

            setTimeout(() => {
                this._animating = false;
                this.lbt("shown");
            }, animation.inner);

            // add inner animation class
            outer.classList.add(`${this._prefix}_inner`);

            // inner animation callback
            this.lbt("innerShow");

            // inner animation end callback
            setTimeout(() => {
                this.lbt("innerShown");
            }, animation.inner);

        }, animation.duration * animation.innerShiftShow);

    }

    /**
     * @description Hide menu.
     * @private
     */
    _hide() {

        // vars
        let outer = this._outer,
            prefix = this._prefix,
            animation = this._prop.animation;

        // set classes
        outer.classList.remove(`${prefix}_showing`);
        outer.classList.add(`${prefix}_hiding`);

        // inner animation callback
        this.lbt("innerHide");

        // change vars
        setTimeout(() => {

            // remove inner animation class
            outer.classList.remove(`${prefix}_inner`);

            // hide class
            outer.classList.add(`${prefix}_hide`);

            // inner animation end callback
            this.lbt("innerHidden");
            
            // remove menu class
            this._button.classList.remove(`${prefix}-button_close`);

            setTimeout(() => {
                this._animating = false;
                this._shown = false;
                outer.classList.remove(`${prefix}_show`);
                outer.classList.remove(`${prefix}_hide`);
                outer.classList.remove(`${prefix}_hiding`);
                this.lbt("hidden");
            }, animation.duration);

        }, animation.inner * animation.innerShiftHide);

    }



}