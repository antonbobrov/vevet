import merge from "./merge";
import DraggerModule from "./DraggerModule";
import Plugin from "./Plugin";
const dom = require('dom-create-element');

const className_hover = 'hover';
const className_noAction = 'no-action';
const className_inAction = 'in-action';
const className_hide = 'hide';

/**
 * @classdesc Adds scrollbars to the ScrollModule. <br>
 * <br><br> <b>import {ScrollBarPlugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Plugin
 * @requires Vevet.DraggerModule
 */
export default class ScrollBarPlugin extends Plugin {


    
    /**
     * @memberof Vevet.ScrollBarPlugin
     * @typedef {object} Properties
     * @augments Vevet.Plugin.Properties
     * 
     * @property {boolean} [draggable=false] - If the scrollbars are draggable.
     * @property {boolean} [autoSize=true] - The size of the scrollbars must be calculated automatically.
     * @property {number} [minSize=50] - The minimal size of a scrollbar.
     */
    /**
     * @alias Vevet.ScrollBarPlugin
     * @description Construct the class.
     * 
     * @param {Vevet.ScrollBarPlugin.Properties} [data]
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @readonly
     * @type {Vevet.ScrollBarPlugin.Properties}
     */
    get defaultProp() {
        return merge(super.defaultProp, {
            draggable: true,
            autoSize: true,
            minSize: 50
        });
    }

    /**
     * @member Vevet.ScrollBarPlugin#prop
     * @memberof Vevet.ScrollBarPlugin
     * @readonly
     * @type {Vevet.ScrollBarPlugin.Properties}
     */

    /**
     * @member Vevet.ScrollBarPlugin#_prop
     * @memberof Vevet.ScrollBarPlugin
     * @protected
     * @type {Vevet.ScrollBarPlugin.Properties}
     */

    /**
     * @function Vevet.ScrollBarPlugin#changeProp
     * @memberof Vevet.ScrollBarPlugin
     * @param {Vevet.ScrollBarPlugin.Properties} [prop]
     */

    /**
     * @member Vevet.ScrollBarPlugin#_m
     * @memberof Vevet.ScrollBarPlugin
     * @protected
     * @type {Vevet.ScrollModule}
     */

    /**
     * @description Get scrollbars.
     * @readonly
     * @type {Vevet.ScrollBarPlugin.Bars}
     */
    get bars() {
        return this._bars;
    }


    
    // Extra Constructor
    _extra() {

        super._extra();

        // init variables
        this._vars();

        // create scrollbars
        this._create();

    }

    /**
     * @memberof Vevet.ScrollBarPlugin
     * @typedef {object} Bars
     * 
     * @property {Vevet.ScrollBarPlugin.Bar} x
     * @property {Vevet.ScrollBarPlugin.Bar} y
     */
    
    /**
     * @memberof Vevet.ScrollBarPlugin
     * @typedef {object} Bar
     * 
     * @property {HTMLElement} outer
     * @property {HTMLElement} bar
     * @property {number} outerWidth
     * @property {number} outerHeight
     * @property {number} barWidth
     * @property {number} barHeight
     */

    _vars() {

        /**
         * @description ScrollModule events.
         * @type {Array<string|false>}
         * @protected
         */
        this._scrollEvents = [];

        /**
         * @description Scrollbars.
         * @type {Vevet.ScrollBarPlugin.Bars}
         * @protected
         */
        this._bars = {};

        /**
         * @description If the scrollbars are being dragged at the moment.
         * @type {boolean}
         * @protected
         */
        this._dragging = false;

    }




    
    /**
     * @description Create scrollbars.
     * @protected
     */
    _create() {

        this._createScrollbar('x');
        this._createScrollbar('y');

    }
    
    /**
     * @description Create a single axis scrollbar.
     * @param { 'x'|'y' } axis
     * @protected
     */
    _createScrollbar(axis) {

        const module = this._m;

        // create an object for the axis
        this._bars[axis] = {};

        const obj = this._bars[axis];
        const prefix = module.prefix;

        // create outer
        obj.outer = dom({
            selector: 'div',
            styles: `${prefix}__scrollbar ${prefix}__scrollbar_${axis} ${className_hide} ${className_noAction}`
        });
        module.outer.appendChild(obj.outer);

        // set events
        obj.outer.addEventListener("mouseenter", () => {
            this._setScrollBarClass(axis, className_hover, true);
        });
        obj.outer.addEventListener("mouseleave", () => {
            this._setScrollBarClass(axis, className_hover, false);
        });

        // create bar
        obj.bar = dom({
            selector: 'div',
            styles: `${prefix}__bar`
        });
        obj.outer.appendChild(obj.bar);

        // variables
        obj.outerWidth = 0;
        obj.outerHeight = 0;
        obj.barWidth = 0;
        obj.barHeight = 0;

    }
    
    /**
     * @description Set classes on scrollbars.
     * @param {string} className
     * @param {boolean} bool - To add or to remove.
     * @protected
     */
    _setScrollBarsClass(className, bool) {
        
        this._setScrollBarClass('x', className, bool);
        this._setScrollBarClass('y', className, bool);

    }
    
    /**
     * @description Set classes on a single scrollbar.
     * @param { 'x'|'y' } axis
     * @param {string} className
     * @param {boolean} bool - To add or to remove.
     * @protected
     */
    _setScrollBarClass(axis, className, bool) {

        const outer = this._bars[axis].outer;
        if (bool) {
            outer.classList.add(className);
        }
        else {
            outer.classList.remove(className);
        }

    }
    


    /**
     * @description Update scrollbar sizes.
     * @protected
     */
    _updateSizes() {

        this._updateBarSize('x');
        this._updateBarSize('y');

        // make visible or unvisible according to the sizes
        this._showHideBars();

    }

    /**
     * @description Update a scrollbar sizes.
     * @protected
     * @param { 'x'|'y' } axis
     */
    _updateBarSize(axis) {

        // get module
        const module = this._m;

        // get scroll sizes
        const outerSizes = module.outerSizes;
        const containerSizes = module.sizes;
        const minSize = this._prop.minSize;

        // get object
        let obj = this._bars[axis];

        // update bar sizes
        if (this._prop.autoSize) {
            if (axis == 'x') {

                const outerWidth = obj.outer.clientWidth;
                let barWidth = outerWidth / (containerSizes[0] / outerSizes[0]);
                if (barWidth < minSize) {
                    barWidth = minSize;
                }

                obj.bar.style.width = barWidth + 'px';
                obj.bar.style.height = '100%';

            }
            else if (axis == 'y') {

                const outerHeight = obj.outer.clientHeight;
                let barHeight = outerHeight / (containerSizes[1] / outerSizes[1]);
                if (barHeight < minSize) {
                    barHeight = minSize;
                }

                obj.bar.style.width = '100%';
                obj.bar.style.height = barHeight + 'px';

            }
        }

        // variables
        obj.outerWidth = obj.outer.clientWidth;
        obj.outerHeight = obj.outer.clientHeight;
        obj.barWidth = obj.bar.clientWidth;
        obj.barHeight = obj.bar.clientHeight;

    }



    /**
     * @description Show/hide bars according to the scroll sizes.
     * @protected
     */
    _showHideBars() {

        this._showHideBar("x");
        this._showHideBar("y");

    }

    /**
     * @description Show/hide a scrollbar according to the scroll sizes.
     * @protected
     * @param { 'x'|'y' } axis
     */
    _showHideBar(axis) {

        // get module
        const module = this._m;

        // get scroll sizes
        const outerSizes = module.outerSizes;
        const containerSizes = module.sizes;

        // get object
        let obj = this._bars[axis];

        // update bar sizes
        if (axis == 'x') {
            if (outerSizes[0] == containerSizes[0]) {
                obj.outer.classList.add(className_hide);
            }
            else {
                obj.outer.classList.remove(className_hide);
            }
        }
        else if (axis == 'y') {
            if (outerSizes[1] == containerSizes[1]) {
                obj.outer.classList.add(className_hide);
            }
            else {
                obj.outer.classList.remove(className_hide);
            }
        }

    }





    /**
     * @description Render scrollbars.
     * @protected
     */
    _render() {

        this._renderBar('x');
        this._renderBar('y');

        this._setScrollBarsClass(className_inAction, true);

    }

    /**
     * @description Render a single scrollbar.
     * @param { 'x'|'y' } axis
     * @protected
     */
    _renderBar(axis) {

        // get module
        const module = this._m;

        // get scrollbar object
        let obj = this._bars[axis];

        // get scroll sizes
        const outerSizes = module.outerSizes;
        const containerSizes = module.sizes;

        // apply transformations
        if (axis == 'y') {

            let line = containerSizes[1] - outerSizes[1],
                progress = module.scrollTop / line,
                lineLength = obj.outerHeight - obj.barHeight;
            obj.bar.style.transform = `translateY(${lineLength * progress}px)`;

        }
        else if (axis == 'x') {

            let line = containerSizes[0] - outerSizes[0],
                progress = module.scrollLeft / line,
                lineLength = obj.outerWidth - obj.barWidth;
            obj.bar.style.transform = `translateX(${lineLength * progress}px)`;

        }

    }





    // Set events
    _setEvents() {

        // drag events
        this._setDrag();

        // update scrollbar sizes
        this._updateSizes();
        this._scrollEvents.push(
            this._m.on("size", this._updateSizes.bind(this))
        );

        // render scrollbar
        this._render();
        this._scrollEvents.push(
            this._m.on("update", this._render.bind(this))
        );

        // event on wheel
        const wheelEvent = this._m.on("wheel", () => {
            this._setScrollBarsClass(className_inAction, true);
            this._setScrollBarsClass(className_noAction, false);
        });
        this._scrollEvents.push(wheelEvent);

        // event on approximation
        const approximateEvent = this._m.on("approximate", () => {
            this._setScrollBarsClass(className_noAction, true);
            this._setScrollBarsClass(className_inAction, false);
        });
        this._scrollEvents.push(approximateEvent);

    }

    /**
     * @description Set Drag Events.
     * @protected
     */
    _setDrag() {

        this._setDragOnBar('x');
        this._setDragOnBar('y');

    }

    /**
     * @description Set Drag Events.
     * @protected
     * @param { 'x'|'y' } axis
     */
    _setDragOnBar(axis) {

        // get scrollbar object
        let obj = this._bars[axis];

        // create a drag
        const dragger = new DraggerModule({
            on: this._prop.draggable,
            outer: obj.bar,
            parent: this,
            thresholdPropagation: {
                dir: axis,
                value: 1
            }
        });

        // add events
        dragger.on("start", this._start.bind(this, axis));
        dragger.on("move", this._move.bind(this, axis));
        dragger.on("end", this._end.bind(this, axis));

    }



    /**
     * @description Start Dragging.
     * @protected
     */
    _start() {

        if (this._m.prop.run & this._prop.draggable) {

            // change bool
            this._dragging = true;

            // set scrollbar classes
            this._setScrollBarsClass(className_inAction, true);
            this._setScrollBarsClass(className_noAction, false);

        }

    }

    /**
     * @description Moving.
     * @param { 'x'|'y' } axis
     * @param {Vevet.DraggerModule.Callback} data
     * @protected
     */
    _move(axis, data) {

        // get module
        const module = this._m;

        // return if disabled
        if (!module.prop.run || !this._prop.draggable || !this._dragging) {
            return;
        }

        // get scrollbar object
        let obj = this._bars[axis];

        // play scroll
        this._m.play();

        // vars
        const step = data.step;

        // get scroll sizes
        const containerSizes = module.sizes;

        if (axis == "x") {
            module.targetLeft += step.x * (containerSizes[0] / (obj.outer.clientWidth - obj.bar.clientWidth));
        }
        else if (axis == "y") {
            module.targetTop += step.y * (containerSizes[1] / (obj.outer.clientHeight - obj.bar.clientHeight));
        }

        // shrink target values
        module._boundariesBoth();

    }

    /**
     * @description Drag end.
     * @protected
     */
    _end() {

        // return if disabled
        if (!this._m.prop.run || !this._prop.draggable) {
            return;
        }

        // change bool
        this._dragging = false;

    }





    // Destroy
    _destroy() {

        super._destroy();

        // remove ScrollModule events
        this._scrollEvents.forEach(event => {
            this._m.remove(event);
        });

        // remove scrollbars
        this._bars['x'].outer.remove();
        this._bars['y'].outer.remove();

    }



}