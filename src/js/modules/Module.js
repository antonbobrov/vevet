import Event from '../events/Event';
import utils from '../core/utils';

/**
 * @classdesc An abstract class for modules.
 * <br><br> <b>import {Module} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class Module extends Event {


    
    /**
     * @memberof Vevet.Module
     * @typedef {object} Responsive
     * 
     * @description Sometimes it may be useful to change properties when the window is resized.
     * There are two ways to do it:
     * <ul>
     *      <li>To set an event on the window when it is resized (or use {@linkcode Vevet.Viewport}).
     *          When the window is resized, change the properties with the help of {@linkcode Vevet.Module#changeProp}</li>
     *      <li>
     *          The second way is to use the property 'responsive'. In the property, set an object with the properties
     *          you would like to change. Responsive properties can be also changed through {@linkcode Vevet.Module#changeProp},
     *          but they must be initialized on start. In case the properties are not initialized on start,
     *          they cannot be changed further.</li>
     * </ul>
     * 
     * @property {number} breakpoint - F.e., 1199. It means that new settings will be applied when the window size is less or equal to 1199px.
     * @property {object} settings - An object with new properties.
     */
    
    /**
     * @description Properties marked by asterisks should not be changed after initializing.
     * 
     * @memberof Vevet.Module
     * @typedef {object} Properties
     * @augments Vevet.Event.Properties
     * @property {Array<Vevet.Module.Responsive>} [responsive] - Responsive Settings.
     * @property {Vevet.Module} [parent] - *** Parent class. When the parent class is destroyed, the child's class will be destroyed also.
     * 
     */
    /**
     * @alias Vevet.Module
     * 
     * @param {Vevet.Module.Properties} data - Class Properties.
     * @param {boolean} [init=true] - Defines if you need to call the init method at the end of the constructor.
     */
    constructor(data = {}, init = true) {
        super(data, init);
    }



    // Extra Constructor
    _extra() {

        // state vars
        this._destroyed = false;

        /**
         * @description Ids of events. F.e., {id: 'id', name: 'name'}.
         * @type {Array<object>}
         * @protected
         */
        this._allEvents = [];

        /**
         * @description Here event listeners on DOM elements are stored.
         * @type {Array<Vevet.Module.Listener>}
         * @protected
         */
        this._listeners = [];

        /**
         * @description List of plugins.
         * @type {Array<Vevet.Plugin>}
         * @protected
         */
        this._plugins = [];

        // we need to make properties responsive to the window size
        // that's why we copy the properties that were already set in Event
        this._referenceProp();

        // destroy when parent is destroyed
        let parent = this._prop.parent;
        if (parent instanceof Module) {
            parent.on("destroy", this.destroy.bind(this));
        }

    }



    // Reference properties
    // These are the properties that can be changed through changeProp
    // but should not be changed through 'responsive' prop.

    _referenceProp() {

        // create object
        this._propRef = utils.merge(this.defaultProp, this._propInit);

        // check if responsive properties exist
        if (typeof this._propRef.responsive != "undefined") {
            // change properties according to the responsive prop
            this._referencePropResponsive();
    
            // set events on resize
            this._addEvent('viewport', {
                target: 'w_',
                name: this._name + ' Responsive',
                do: () => {
                    this._referencePropResponsive(true);
                }
            });
        }

    }

    _referencePropResponsive(resize = false) {

        let responsive = this._propRef.responsive;
        
        // check if responsive property exists
        if (responsive) {

            // get sizes
            let viewport = this._v.viewport,
                width = viewport.size[0];
            
            // go through all breakpoints
            // check if breakpoint exists
            let breakpointExists = false;
            responsive.forEach((obj) => {

                // copy settings
                let settings = obj.settings,
                    breakpoint = obj.breakpoint;

                // if breakpoint is a number
                if (typeof breakpoint == 'number') {
                    if (width <= obj.breakpoint) {
                        this._prop = utils.merge(this._prop, settings);
                        breakpointExists = true;
                    }
                }
                // if breakpoint is a string // desktop, tablet, mobile, mobiledevice
                else if (typeof breakpoint === 'string') {
                    breakpoint = breakpoint.toLowerCase();
                    if (breakpoint === 'd' & viewport.desktop) {
                        this._prop = utils.merge(this._prop, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 't' & viewport.tablet) {
                        this._prop = utils.merge(this._prop, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 'm' & viewport.mobile) {
                        this._prop = utils.merge(this._prop, settings);
                        breakpointExists = true;
                    }
                    if (breakpoint === 'md' & viewport.mobiledevice) {
                        this._prop = utils.merge(this._prop, settings);
                        breakpointExists = true;
                    }
                }

            });

            // if breakpoint does not exist, restore the props
            if (!breakpointExists) {
                this._prop = utils.merge(this._prop, this._propRef);
            }

            // change prop
            if (resize) {
                this._changeProp();
            }

        }

    }



    /**
     * @description Change properties. See {@linkcode typedef Properties} to get more info.
     * @param {object} prop - New Properties.
     * @example
     * 
     * // changing properties
     * // let's imagine that the module has the following properties:
     * prop = {
     *     name: 'module',
     *     cute: true
     * };
     * // we can change some properties in it: whether one or several properties
     * // after the properties are changed, the method _changeProp is called.
     * module.changeProp({
     *     cute: false
     * });
     */
    changeProp(prop) {

        this._prop = utils.merge(this._prop, prop);
        this._propRef = utils.merge(this._propRef, prop);
        this._changeProp();

        this.lbt("changeProp");
        
    }

    _changeProp() { }



    /**
     * @description Add events of different types. See {@linkcode Vevet.Event}.
     * 
     * @protected
     * 
     * @param {string|Array<string>} name - Name of the event class, f.e., viewport, load, etc.
     * @param {object} data - Event's data.
     * @param {boolean} [bool=true] - Defines if the event will be enabled.
     * 
     * @returns {string|boolean|Array<string|boolean>} Returns a string with an id or false if the event cannot be added. If there were several names, it will return an array with strings & booleans.
     */
    _addEvent(name, data, bool = true) {

        let ids = [],
            returning = [];

        if (Array.isArray(name)) {
            for (let i = 0; i < name.length; i++) {
                let id = this._addEventHelper(name[i], data, bool);
                ids.push([id, name[i]]);
            }
        }
        else {
            let id = this._addEventHelper(name, data, bool);
            ids.push([id, name]);
        }

        for (let i = 0; i < ids.length; i++) {
            if (ids[i][0]) {
                this._allEvents.push({
                    id: ids[i][0],
                    name: ids[i][1]
                });
                returning.push(ids[i][0]);
            }
        }

        if (Array.isArray(name)) {
            return returning;
        }
        else {
            return returning[0];
        }

    }

    _addEventHelper(name, data, bool) {
        return this._v[name].add(data, bool);
    }

    /**
     * @description Remove events of different types. See {@linkcode Vevet.Event}.
     * 
     * @protected
     * 
     * @param {string} id - Id of the event.
     * 
     * @returns {boolean} Returns true if success.
     */
    _removeEvent(id) {

        let newEvents = [],
            result = false;

        for (let i = 0; i < this._allEvents.length; i++) {
            let event = this._allEvents[i];
            if (id === event.id) {
                result = this._v[event.name].remove(event.id);
            }
            else {
                newEvents.push(event);
            }
        }

        // update events array
        this._allEvents = newEvents;

        return result;

    }

    /**
     * @description Remove all events of different types. See {@linkcode Vevet.Event}.
     * 
     * @protected
     * 
     * @returns {boolean} Returns true if success.
     */
    _removeEvents() {

        for (let i = 0; i < this._allEvents.length; i++) {
            this._removeEvent(this._allEvents[i].id);
        }

        return true;

    }



    /**
     * @description All event listeners created within the class.
     * @readonly
     * @type {Array<Vevet.Module.Listener>}
     */
    get listeners() {
        return this._listeners();
    }

    /**
     * @memberof Vevet.Module
     * @typedef {object} Listener
     * @property {string} id Id of the event.
     * @property {Window|HTMLElement} el Element with the event.
     * @property {string} target Target of the event.
     * @property {Function} do Callback of the event.
     */
    /**
     * @memberof Vevet.Module
     * @typedef {object} ListenerData
     * @property {Window|HTMLElement} el - Element.
     * @property {string} target - Target of the event.
     * @property {Function} do - Callback.
     */
    /**
     * @description Add event listener to an element.
     * 
     * @param {Vevet.Module.ListenerData} data - Event's data.
     * 
     * @returns {Vevet.Module.Listener} Returns data.
     * 
     * @example
     * module.addEventListener({
     *     el: el,
     *     target: 'click',
     *     do: () => { 
     *         alert("Clicked!");
     *     }
     * });
     */
    addEventListener(data) {

        let result = utils.bindEventListener(data);
        this._listeners.push(result);

        return result;

    }
    /**
     * @description Add event listener to an element. This is a short form of {@linkcode Vevet.Module#addEventListener}.
     * 
     * @param {Window|HTMLElement} el - Element for the event.
     * @param {string} target - Target of the event.
     * @param {Function} callback - Callback.
     * 
     * @returns {Vevet.Module.Listener} Returns data.
     * 
     * @example
     * module.listener(el, "click", () => { 
     *     alert("Clicked!");
     * });
     */
    listener(el, target, callback) {
        return this.addEventListener({
            el: el,
            target: target,
            do: callback
        });
    }

    /**
     * @description Remove an event listener from the element.
     * 
     * @protected
     * 
     * @param {object} data - Event's data.
     * @param {Window|HTMLElement} data.el - Element with the event.
     * @param {string} data.id - Id of the event.
     * 
     * @returns {boolean} Returns true if the listener is found and removed.
     * 
     * @example
     * event.removeEventListener({
     *     el: el,
     *     id: 'id'
     * });
     */
    removeEventListener(data) {

        for (let i = 0; i < this._listeners.length; i++) {
            let event = this._listeners[i];
            if (event.id === data.id) {
                utils.unbindEventListener(event);
                this._listeners.splice(i, 1);
                return true;
            }
        }

        return false;

    }

    /**
     * @description Remove all event listeners created within the class.
     * 
     * @protected
     * 
     * @example
     * event.removeEventListeners();
     */
    removeEventListeners() {
        
        while (this._listeners.length > 0) {
            let event = this._listeners[0];
            this.removeEventListener({
                el: event.el,
                id: event.id
            });
        }

    }



    /**
     * @description Add a new plugin to the module
     * @param {Vevet.Plugin} plugin - Plugin. 
     * 
     * @example
     * module.addPlugin(new Plugin({
     *      settings: {
     *          works: true
     *      }
     * }));
     */
    addPlugin(plugin) {

        this._plugins.push(plugin);

        // init plugin
        plugin.init(this);

    }

    /**
     * @description Remove all plugins.
     */
    removePlugins() {
        for (let i = 0; i < this._plugins.length; i++) {
            this._plugins[i].destroy();
        }
        this._plugins = [];
    }



    /**
     * @description Destroy the class.
     * @protected
     */
    _destroy() {

        // launch events
        this.lbt("destroy");

        // remove events
        this.removeAll();
        this._removeEvents();
        // remove listeners
        this.removeEventListeners();
        // remove plugins
        this.removePlugins();

        // change bools
        this._destroyed = true;

    }

    /**
     * @description Destroy the class.
     */
    destroy() {

        this._destroy();

    }



}