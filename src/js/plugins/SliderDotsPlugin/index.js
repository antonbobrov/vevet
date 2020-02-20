const dom = require('dom-create-element');
import utils from '../../core/utils';
import Plugin from '../Plugin';

/**
 * @classdesc Add dots to control your slider. <br>
 * <br><br> <b>import {SliderDotsPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 */
export default class SliderDotsPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderDotsPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     */
    /**
     * @alias Vevet.SliderDotsPlugin
     * 
     * @param {Vevet.SliderDotsPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderDotsPlugin.Properties}
     */
    get defaultProp() {
        return utils.merge(super.defaultProp, {
            on: true
        });
    }

    /**
     * @member Vevet.SliderDotsPlugin#prop
     * @memberof Vevet.SliderDotsPlugin
     * @readonly
     * @type {Vevet.SliderDotsPlugin.Properties}
     */

    /**
     * @member Vevet.SliderDotsPlugin#_prop
     * @memberof Vevet.SliderDotsPlugin
     * @protected
     * @type {Vevet.SliderDotsPlugin.Properties}
     */

    /**
     * @function Vevet.SliderDotsPlugin#changeProp
     * @memberof Vevet.SliderDotsPlugin
     * @param {Vevet.SliderDotsPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderDotsPlugin#_m
     * @memberof Vevet.SliderDotsPlugin
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
        this._me = [];

        // create dots
        this._dots = [];
        
        // create outer
        this._outer = dom({
            selector: 'ul',
            styles: `${prefix}__dots`
        });
        outer.appendChild(this._outer);

        // create dots
        for (let i = 0; i < module.total; i++) {

            let li = dom({
                selector: 'li'
            });
            this._outer.appendChild(li);

            let button = dom({
                selector: 'button',
                styles: `${prefix}__dot`
            });
            li.appendChild(button);
            this._dots.push(button);

        } 

        // set classes
        this._classes();

    }



    // Set events
    _setEvents() {

        let module = this._m;

        // controls
        for (let i = 0; i < this._dots.length; i++) {
            this.listener(this._dots[i], 'click', () => {
                module.set(i, "none");
            });
        }

        // events
        this._classesActive(module.active);
        this._me.push(module.on("show", () => {
            this._classesActive(module.active);
        }));
        this._me.push(module.on("hide", () => {
            this._classesActive(-1);
        }));
        this._me.push(module.on("start", (data) => {
            this._classesActive(data.next);
        }));

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
            hiddenClass = `${prefix}_dots-hidden`;

        // show & hide
        if (!prop.on) {
            outer.classList.add(hiddenClass);
        }
        else {
            outer.classList.remove(hiddenClass);
        }

    }

    /**
     * @description Set active classes.
     * @param {number} num
     * @private
     */
    _classesActive(num) {

        let module = this._m,
            prefix = module.prefix,
            activeClass = `${prefix}__dot_active`;

        // set classes
        for (let i = 0; i < this._dots.length; i++) {
            if (i == num) {
                this._dots[i].classList.add(activeClass);
            }
            else {
                this._dots[i].classList.remove(activeClass);
            }
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        // remove elements
        this._outer.remove();

        // get module
        let module = this._m;

        // remove events
        this._me.forEach(id => {
            module.remove(id);
        });

    }



}