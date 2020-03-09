import Event from './Event';
import ResponsiveProp from './ResponsiveProp';
import eventListenerAdd from './eventListenerAdd';
import merge from './merge';
import eventListenerRemove from './eventListenerRemove';
const isarray = require('isarray');

/**
 * @classdesc An abstract class for modules.
 * <br><br> <b>import {Module} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.Event
 * @requires Vevet.ResponsiveProp
 */
export default class Module extends Event {


    
    /**
     * @description Properties marked by asterisks should not be changed after initializing.
     * 
     * @memberof Vevet.Module
     * @typedef {object} Properties
     * @augments Vevet.Event.Properties
     * @property {Array<Vevet.ResponsiveProp.Responsive>} [responsive] - *** Responsive Settings.
     * @property {Vevet.Module} [parent] - *** Parent class. When the parent class is destroyed, the child's class will be destroyed also.
     * 
     */
    /**
     * @alias Vevet.Module
     * 
     * @param {Vevet.Module.Properties} [data] - Class Properties.
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
         * @type {Array<Vevet.BindListener>}
         * @protected
         */
        this._listeners = [];

        /**
         * @description List of plugins.
         * @type {Array<Vevet.Plugin>}
         * @protected
         */
        this._plugins = [];

        // Create responsive properties
        this._responsiveProp = new ResponsiveProp(
            this._prop,
            this._changeProp.bind(this), 
            this._changeProp.bind(this)
        );
        this._prop = this._responsiveProp._prop;
        this.on("destroy", () => {
            this._responsiveProp.destroy();
        });

        // destroy when parent is destroyed
        let parent = this._prop.parent;
        if (parent instanceof Module) {
            parent.on("destroy", this.destroy.bind(this));
        }

    }



    /**
     * @description Change properties. See {@linkcode typedef Properties} to get more info.
     * @param {Vevet.Module.Properties} [prop] - New Properties.
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
    changeProp(prop = {}) {
        this._responsiveProp.changeProp(prop);
        this.lbt("changeProp");
    }

    _changeProp() { }

    /**
     * @member Vevet.Module#defaultProp
     * @memberof Vevet.Module
     * @readonly
     * @type {Vevet.Module.Properties}
     */

    /**
     * @member Vevet.Module#prop
     * @memberof Vevet.Module
     * @readonly
     * @type {Vevet.Module.Properties}
     */

    /**
     * @member Vevet.Module#_prop
     * @memberof Vevet.Module
     * @protected
     * @type {Vevet.Module.Properties}
     */



    /**
     * @description Add events of different types. See {@linkcode Vevet.Event}.
     * 
     * @protected
     * 
     * @param {string|Array<string>} name - Name of the event class, f.e., viewport, load, etc.
     * @param {object} data - Event's data.
     * @param {boolean} [bool=true] - Defines if the event will be enabled.
     * 
     * @returns {string|false|Array<string|false>} Returns a string with an id or false if the event cannot be added. If there were several names, it will return an array with strings & booleans.
     */
    _addEvent(name, data, bool = true) {

        let ids = [],
            returning = [];

        if (isarray(name)) {
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

        if (isarray(name)) {
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
     * @type {Array<Vevet.BindListener>}
     */
    get listeners() {
        return this._listeners();
    }

    /**
     * @description Add event listener to an element.
     * 
     * @param {Vevet.Listener} data - Event's data.
     * 
     * @returns {Vevet.BindListener} Returns data.
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

        let result = eventListenerAdd(data);
        this._listeners.push(result);

        return result;

    }
    /**
     * @description Add event listener to an element. This is a short form of {@linkcode Vevet.Module#addEventListener}.
     * 
     * @param {Window|HTMLElement} el - Element for the event.
     * @param {string} target - Target of the event.
     * @param {Function} callback - Callback.
     * @param {Vevet.Listener} data - Additional settings.
     * 
     * @returns {Vevet.BindListener} Returns data.
     * 
     * @example
     * module.listener(el, "click", () => { 
     *     alert("Clicked!");
     * });
     */
    listener(el, target, callback, data = {}) {
        return this.addEventListener(merge({
            el: el,
            target: target,
            do: callback
        }, data));
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
                eventListenerRemove(event);
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