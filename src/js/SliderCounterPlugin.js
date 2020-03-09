const dom = require('dom-create-element');
import Plugin from './Plugin';
import merge from './merge';

/**
 * @classdesc Add a counter to control your slider. <br>
 * <br><br> <b>import {SliderCounterPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 */
export default class SliderCounterPlugin extends Plugin {


    
    /**
     * @memberof Vevet.SliderCounterPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [on=true] - If enabled.
     */
    /**
     * @alias Vevet.SliderCounterPlugin
     * 
     * @param {Vevet.SliderCounterPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.SliderCounterPlugin.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            on: true
        });
    }

    /**
     * @member Vevet.SliderCounterPlugin#prop
     * @memberof Vevet.SliderCounterPlugin
     * @readonly
     * @type {Vevet.SliderCounterPlugin.Properties}
     */

    /**
     * @member Vevet.SliderCounterPlugin#_prop
     * @memberof Vevet.SliderCounterPlugin
     * @protected
     * @type {Vevet.SliderCounterPlugin.Properties}
     */

    /**
     * @function Vevet.SliderCounterPlugin#changeProp
     * @memberof Vevet.SliderCounterPlugin
     * @param {Vevet.SliderCounterPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.SliderCounterPlugin#_m
     * @memberof Vevet.SliderCounterPlugin
     * @protected
     * @type {Vevet.SliderModule|Vevet.SliderCanvasModule}
     */


    
    // Extra Constructor
    _extra() {

        super._extra();

        // get module
        let module = this._m,
            prefix = module.prefix,
            outer = module._outer,
            count = module.total;

        /**
         * @description Module events IDs.
         * @protected
         * @member {Array<string>}
         */
        this._me = [];
        
        /**
         * @description Counter outer element.
         * @protected
         * @member {HTMLElement}
         */
        this._outer = dom({
            selector: 'div',
            styles: `${prefix}__counter`
        });
        outer.appendChild(this._outer);

        // create currents
        let currents = dom({
            selector: 'div',
            styles: `${prefix}__currents`
        });
        this._outer.appendChild(currents);

        /**
         * @description Numbers.
         * @protected
         * @member {Array<HTMLElement>}
         */
        this._currents = [];
        for (let i = 0; i < count; i++) {

            let el = dom({
                selector: 'div',
                styles: `${prefix}__current`
            });
            currents.appendChild(el);
            this._currents.push(el);

            let num = i + 1;
            num = num < 10 ? `0${num}` : num;
            el.innerHTML = num;

        } 

        // create line
        let line = dom({
            selector: 'div',
            styles: `${prefix}__line`
        });
        this._outer.appendChild(line);

        // create total
        let total = dom({
            selector: 'div',
            styles: `${prefix}__total`
        });
        let num = count < 10 ? `0${count}` : count;
        total.innerHTML = num;
        this._outer.appendChild(total);

        // set classes
        this._classes();
        this._classesActive(module.active);

    }



    // Set events
    _setEvents() {

        let module = this._m;

        // events
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
     * @protected
     */
    _classes() {

        let prop = this._prop,
            module = this._m,
            outer = module._outer,
            prefix = module.prefix,
            hiddenClass = `${prefix}_counter-hidden`;

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
     * @protected
     */
    _classesActive(num) {

        let module = this._m,
            prefix = module.prefix,
            activeClass = `${prefix}__current_active`,
            currents = this._currents;

        // set classes
        for (let i = 0; i < currents.length; i++) {
            if (i == num) {
                currents[i].classList.add(activeClass);
            }
            else {
                currents[i].classList.remove(activeClass);
            }
        }

    }



    // Destroy events
    _destroy() {

        super._destroy();

        // get module
        let module = this._m;

        // remove elements
        this._outer.remove();

        // remove events
        this._me.forEach(id => {
            module.remove(id);
        });

    }



}