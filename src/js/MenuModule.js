import merge from './merge';
import MenuBaseModule from './MenuBaseModule';

/**
 * @classdesc A class for creating pop-up menus.
 * All animation are set in CSS, here you set timings only.
 * The menu can't be closed if the animaiton of its opening has not ended yet and vice versa. <br>
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
 * <br><br> <b>import {MenuModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.MenuModule : show :  }
 * @vevetModuleCallback { Vevet.MenuModule : shown :  }
 * @vevetModuleCallback { Vevet.MenuModule : innerShow :  }
 * @vevetModuleCallback { Vevet.MenuModule : innerShown :  }
 * @vevetModuleCallback { Vevet.MenuModule : hide :  }
 * @vevetModuleCallback { Vevet.MenuModule : innerHide :  }
 * @vevetModuleCallback { Vevet.MenuModule : innerHidden :  }
 * @vevetModuleCallback { Vevet.MenuModule : hidden :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.MenuBaseModule
 */
export default class MenuModule extends MenuBaseModule {


    
    /**
     * @memberof Vevet.MenuModule
     * @typedef {object} Properties
     * @augments Vevet.MenuBaseModule.Properties
     * 
     * @property {object} [animation] - The class uses timeouts to calculate the animation boundaries.
     * @property {number} [animation.duration=750] - The duration of animation of the outer when it is being shown or hidden.
     * @property {number} [animation.inner=0] - The inner duration of the menu. F.e., if you need to animate links before closing the menu.
     * @property {number} [animation.innerShiftShow=1] - Shift of inner animation before showing. It means that inner animation will start after (1 * animation.duration) since the button was pushed.
     * @property {number} [animation.innerShiftHide=1] - Shift of inner animation before hiding. It means that inner animation will start after (1 * animation.inner) since the button was pushed.
     */
    /**
     * @alias Vevet.MenuModule
     * 
     * @param {Vevet.MenuModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    /**
     * @readonly
     * @type {Vevet.MenuModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            animation: {
                duration: 500,
                button: 500,
                inner: 0,
                innerShiftShow: 1,
                innerShiftHide: 1
            }
        });

    }

    /**
     * @member Vevet.MenuModule#prop
     * @memberof Vevet.MenuModule
     * @readonly
     * @type {Vevet.MenuModule.Properties}
     */

    /**
     * @member Vevet.MenuModule#_prop
     * @memberof Vevet.MenuModule
     * @protected
     * @type {Vevet.MenuModule.Properties}
     */

    /**
     * @function Vevet.MenuModule#changeProp
     * @memberof Vevet.MenuModule
     * @param {Vevet.MenuModule.Properties} [prop]
     */



    /**
     * @description If the menu is animating: opening or closing.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get animating() {
        return this._animating;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        // variables
        this._animating = false;

    }



    /**
     * @description Show/Hide the menu.
     * @returns {boolean} Returns true if the menu can be opened or closed.
     */
    toggle() {

        // check if animating
        if(this._animating){
            return false;
        }
        this._animating = true;

        // continue
        return super.toggle();
        
    }



    /**
     * @description Show the menu.
     * @protected
     */
    _show() {

        super._show();

        // vars
        let outer = this._outer,
            prefix = this._prefix,
            animation = this._prop.animation;

        // set classes
        outer.classList.add(`${prefix}_show`);
        if (this._button) {
            this._button.classList.add(`${prefix}-button_close`);
        }

        // show inner
        setTimeout(() => {

            // add inner animation class
            outer.classList.add(`${prefix}_inner`);
            // inner animation callback
            this.lbt("innerShow");

            setTimeout(() => {
                this._animating = false;
                this.lbt("innerShown");
                this.lbt("shown");
            }, animation.inner);

        }, animation.duration * animation.innerShiftShow);

    }

    /**
     * @description Hide the menu.
     * @protected
     */
    _hide() {

        super._hide();

        // vars
        let outer = this._outer,
            prefix = this._prefix,
            animation = this._prop.animation;

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
            if (this._button) {
                this._button.classList.remove(`${prefix}-button_close`);
            }

            setTimeout(() => {
                this._animating = false;
                this._shown = false;
                outer.classList.remove(`${prefix}_show`);
                outer.classList.remove(`${prefix}_hide`);
                this.lbt("hidden");
            }, animation.duration);

        }, animation.inner * animation.innerShiftHide);

    }



}