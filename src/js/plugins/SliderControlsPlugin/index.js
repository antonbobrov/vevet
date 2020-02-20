const dom = require('dom-create-element');
import utils from '../../core/utils';
import Plugin from '../Plugin';

/**
 * @classdesc Add previous and next controls to your slider. <br>
 * <br><br> <b>import {SliderControlsPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 */
export default class SliderControlsPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderControlsPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     */
    /**
     * @alias Vevet.SliderControlsPlugin
     * 
     * @param {Vevet.SliderControlsPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderControlsPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            on: true
        });
    }

    /**
     * @member Vevet.SliderControlsPlugin#prop
     * @memberof Vevet.SliderControlsPlugin
     * @readonly
     * @type {Vevet.SliderControlsPlugin.Properties}
     */

    /**
     * @member Vevet.SliderControlsPlugin#_prop
     * @memberof Vevet.SliderControlsPlugin
     * @protected
     * @type {Vevet.SliderControlsPlugin.Properties}
     */

    /**
     * @function Vevet.SliderControlsPlugin#changeProp
     * @memberof Vevet.SliderControlsPlugin
     * @param {Vevet.SliderControlsPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderControlsPlugin#_m
     * @memberof Vevet.SliderControlsPlugin
     * @protected
     * @type {Vevet.SliderModule|Vevet.SliderCanvasModule}
     */


    
    // Extra Constructor
    _extra() {

        super._extra();

        // get module
        let module = this._m,
            prefix = module.prefix,
            outer = module._outer;

        // vars
        let controlClass = `${prefix}__control`;
        this._me = [];

        // create controls
        let prev = dom({
            selector: 'button',
            styles: `${controlClass} ${controlClass}_prev`
        });
        outer.appendChild(prev); 

        let next = dom({
            selector: 'button',
            styles: `${controlClass} ${controlClass}_next`
        });
        outer.appendChild(next); 

        this._prev = prev;
        this._next = next;

        // set classes
        this._classes();

    }



    // Set events
    _setEvents() {

        let module = this._m;

        // controls
        this.listener(this._prev, 'click', () => {
            module.prev('control');
        });
        this.listener(this._next, 'click', () => {
            module.next('control');
        });

        // events
        this._me.push(module.on("changeProp", this._classes.bind(this)));
        this._me.push(module.on("show", this._classes.bind(this)));
        this._me.push(module.on("hide", this._classes.bind(this)));
        this._me.push(module.on("start", this._classes.bind(this)));

    }

    // When properties are changed.
    _changeProp() {

        // set classes
        this._classes();

    }



    /**
     * @description Set classes.
     * @private
     */
    _classes() {

        let prop = this._prop,
            module = this._m,
            outer = module._outer,
            prefix = module.prefix,
            hiddenClass = `${prefix}_controls-hidden`,
            active = module.active,
            moduleProp = module.prop,
            disabledAttr = "disabled";

        // show & hide
        if (!prop.on) {
            outer.classList.add(hiddenClass);
        }
        else {
            outer.classList.remove(hiddenClass);
        }

        // if disabled
        if ((active === 0 & !moduleProp.loop) || !moduleProp.prev) {
            this._prev.setAttribute(disabledAttr, true);
        }
        else{
            this._prev.removeAttribute(disabledAttr);
        }
        if ((active === (module.total - 1) & !moduleProp.loop) || !moduleProp.next) {
            this._next.setAttribute(disabledAttr, true);
        }
        else{
            this._next.removeAttribute(disabledAttr);
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        // get module
        let module = this._m;

        // remove elements
        this._prev.remove();
        this._next.remove();

        // remove events
        this._me.forEach(id => {
            module.remove(id);
        });

    }



}