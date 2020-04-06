import getVevetProperties from './getVevetProperties';
import merge from './merge';
import generateId from './generateId';
import timeoutCallback from './timeoutCallback';

/**
 * @classdesc A class for callbacks' manipulation.
 * <br><br> <b>import {Event} from 'vevet';</b>
 * @class
 * @abstract
 * @memberof Vevet
 */
export default class Event {


    
    /**
     * @typedef {object} Vevet.Event.Properties
     * 
     * @property {Vevet.Application} [v] - Vevet Application.
     * @property {Array<Vevet.Event.EventObj>} [callbacks] - Vevet Events. Almost equal to {@linkcode Vevet.Event#add}.
     */
    /**
     * @alias Vevet.Event
     * 
     * @param {Vevet.Event.Properties} [data]
     * @param {boolean} [init=true] - Defines if you need to call {@linkcode Vevet.Event#init} at the constructor's end.
     * 
     * @example 
     * let data = {
     *     v: window.vevetApplication
     * };
     * let event = new Vevet.Event(data);
     * 
     */
    constructor(data, init = true) {

        // get vevet application if not exists
        data = getVevetProperties(data);

        /**
         * @description Vevet Application.
         * @type {Vevet.Application}
         * @protected
         */
        this._v = data.v;
        /**
         * @description Vevet Application Properties.
         * @type {Vevet.Application.Properties}
         * @protected
         */
        this._vp = this._v.prop;
        /**
         * @description Class Prefix.
         * @type {string}
         * @protected
         */
        this._prefix = this.prefix;

        /**
         * @description Current Properties.
         * @type {Vevet.Event.Properties}
         * @protected
         */
        this._prop = merge(this.defaultProp, data);

        /**
         * @type {string}
         * @protected
         */
        this._name = this.constructor.name;
        /**
         * @description Vevet Callbacks.
         * @type {Array<Vevet.Event.EventData>}
         * @protected
         */
        this._events = [];

        /**
         * @description A short alias for {@linkcode Vevet.Event#launchByTarget}
         * @type {Function}
         */
        this.lbt = this.launchByTarget;

        // add callbacks
        this._prop.callbacks.forEach(callback => {
            this.add(callback);
        });

        // initialize
        if (init) {
            this._init();
        }

    }



    /**
     * @description Default properties. See {@linkcode typedef Properties} to get more info.
     * @readonly
     * @type {Vevet.Event.Properties}
     */
    get defaultProp() {
        return {
            v: window.vevetApplication,
            callbacks: []
        };
    }

    /**
     * @description Current Properties. See {@linkcode typedef Properties} to get more info.
     * @type {Vevet.Event.Properties}
     */
    get prop() {
        return this._prop;
    }

    /**
     * @description Get the name of the class.
     * @readonly
     * @type {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @memberof Vevet.Event
     * @typedef {object} EventData
     * @property {string} id Id of the callback.
     * @property {boolean} on Defines if the callback is enabled.
     * @property {Vevet.Event.EventObjWithTarget} data Callback data.
     */
    /**
     * @memberof Vevet.Event
     * @typedef {object} EventObjWithTarget
     * @augments Vevet.Event.EventObj
     * @property {string} [target] The target name of the callback.
     */
    /**
     * @memberof Vevet.Event
     * @typedef {object} EventObj
     * @augments Vevet.Event.EventObjSettings
     * @property {Function} do Callback itself.
     */
    /**
     * @memberof Vevet.Event
     * @typedef {object} EventObjSettings
     * @property {string} [name] A Name of the callback if needed. It is useful when you need to trace callbacks from different modules.
     * @property {number} [timeout] A timeout of the callback.
     * @property {boolean} [protected] Defines if the callback can be deleted or not. 
     * @property {boolean} [once] Defines if the callback will be deleted right after it is launched.
     */
    /**
     * @description All callbacks.
     * @readonly
     * @type {Array<Vevet.Event.EventData>}
     */
    get events() {
        return this._events;
    }



    /**
     * @description An empty method that is called in {@linkcode Vevet.Event#_init}.
     * This can be used in other classes to extend the default constructor.
     * @protected
     */
    _extra() { }

    /**
     * @description Initializes the class.
     * @protected
     */		    
    _init() {
        this._extra();
        this._setEvents();
    }

    /**
     * @description An empty method that is called in {@linkcode Vevet.Event#_init}.
     * This can be used in other classes to extend the default constructor.
     * @protected
     */
    _setEvents() { }
    


    /**
     * @description Adds a callback.
     * 
     * @param {Vevet.Event.EventObj} data - Callback data.
     * @param {boolean} [bool=true] - Defines if the event is enabled.
     * 
     * @returns {string} Returns a string with the callback's id.
     * 
     * @example
     * let id = event.add({
     *     // if targets are available
     *     target: 'target name',
     *     do: () => {
     *         alert("callback launched");
     *     }
     * }, true);
     */
    add(data, bool = true) {

        let id = generateId(this.name),
            array = {
                id: id,
                on: bool,
                data: data
            };
        
        this._events.push(array);

        this._addCallback(id);
        
        return id;

    }

    /**
     * @description Use it to carry out some actions after adding callbacks.
     * 
     * @protected
     * @param {string} id - Callback id.
     */
    // eslint-disable-next-line no-unused-vars
    _addCallback(id) { }
    
    /**
     * @description Add a callback. This is a short form of {@linkcode Vevet.Event#add}
     * 
     * @param {string} target - Event target name.
     * @param {Function} callback - Callback itself.
     * @param {Vevet.Event.EventObjSettings} [prop] - Other settings.
     * 
     * @returns {string} Returns a string with the callback's id.
     * 
     * @example
     * let id = event.on('target name', () => {
     *     alert("callback launched");
     * });
     */
    on(target, callback, prop = {}) {

        let obj = merge(prop, {
            target: target,
            do: callback
        });

        return this.add(obj);

    }
    


    /**
     * @description Remove a callback.
     * 
     * @param {string} id - Id of the callback to be deleted.
     * @returns {boolean} Returns true if callback is deleted.
     * 
     * @example
     * event.remove('id');
     * 
     */
    remove(id) {

        let events = this._events,
            newEvents = [],
            removed = false;
        
        for (let i = 0; i < events.length; i++) {

            // copy vars
            let event = events[i];

            // check id
            if (event.id !== id) {
                // add callback to the new array
                newEvents.push(event);
                continue;
            } 

            // check if the callback is protected
            let protectedCallback = false,
                protectedData = event.data.protected;
            if (typeof protectedData == 'boolean') {
                if (protectedData) {
                    protectedCallback = true;
                }
            }
            
            // remove callback if not protected
            if (!protectedCallback) {
                this._removeCallback(id);
                removed = true;
            }
            else {
                // add callback to the new array
                newEvents.push(event);
            }
    
        }

        // replace array
        this._events = newEvents;

        // return results
        return removed;

    }

    /**
     * @description Use this method for some actions when callbacks are removed.
     * 
     * @protected
     * @param {string} id - Callback id.
     */
    // eslint-disable-next-line no-unused-vars
    _removeCallback(id) { }
    
    /**
     * @description Remove all callbacks.
     */
    removeAll() {

        while (this._events.length > 0) {
            this.remove(this._events[0].id);
        }

    }
    


    /**
     * @description Enable/disable a callback.
     * 
     * @param {string} id - Id of a callback to enable or disable.
     * @param {boolean} [bool=true] - Set true to enable & false to disable.
     * 
     * @returns {boolean} Returns true if the event is enabled.
     * 
     * @example
     * event.turn('id', false);
     * event.turn('id', true);
     * 
     */
    turn(id, bool = true) {

        let event = this.get(id);
        if (event) {
            event.on = bool;
            this._turnCallback(id);
            return true;
        }
        
        return false;

    }

    /**
     * @description Use this method for some actions when callbacks are enabled or disabled.
     * 
     * @protected
     * @param {string} id - Callback id.
     */
    // eslint-disable-next-line no-unused-vars
    _turnCallback(id) { }
    


    /**
     * @description Get a callback by id.
     * @param {string} id - Id of the callback.
     * 
     * @returns {(false|Vevet.Event.EventData)} Returns false if callback does not exist or its object if it does.
     */
    get(id) {

        let events = this._events;
        
        for (let i = 0; i < events.length; i++) {
            if (events[i].id === id) {
                return events[i];
            }
        }

        return false;

    }
    


    /**
     * @description Launch a callback. It will work if the callback is enabled.
     * 
     * @protected
     * 
     * @param {Vevet.Event.EventData} obj - Callback's object.
     * @param {object|false} [arg] - Callback's arguments.
     */
    _launch(obj, arg = false) {

        // check if enabled
        if (!obj.on) {
            return;
        }

        // copy vars
        let data = obj.data,
            callback = data.do,
            timeout = 0;

        // check if timeout exists
        if (data.timeout) {
            timeout = data.timeout;
        }

        // launch
        if (timeout === 0) {
            this._launchCallback(callback, arg);
        }
        else {
            timeoutCallback(this._launchCallback.bind(this, callback, arg), timeout);
        }

        // remove once-callback
        if (typeof data.once == 'boolean') {
            if (data.once) {
                this.remove(obj.id);
            }
        }

    }

    /**
     * @description Launch a callback.
     * 
     * @protected
     * 
     * @param {Function} callback
     * @param {object} arg
     */
    _launchCallback(callback, arg) {
        if (arg) {
            callback(arg);
        }
        else {
            callback();
        }
    }

    /**
     * @description Launch all callbacks.
     */
    launchAll() {

        this._events.forEach(event => {
            this._launch(event);
        });

    }

    /**
     * @description Launch all enabled events with a certain target.
     * 
     * @param {string} target - The name of the target.
     * @param {object} [arg] - Callback's arguments.
     * 
     * @example
     * event.launchByTarget('target name', {
     *     firstname: 'John',
     *     secondname: 'Doe'
     * });
     */
    launchByTarget(target, arg = {}) {

        this._events.forEach(event => {
            if (event.data.target === target) {
                this._launch(event, arg);
            }
        });

    }



}