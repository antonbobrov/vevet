import Module from './Module';

/**
 * @classdesc A base plugin. <br>
 * <br><br> <b>import {Plugin} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Plugin extends Module {


    
    /**
     * @memberof Vevet.Plugin
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     */
    /**
     * @alias Vevet.Plugin
     * @description Construct the class.
     * 
     * @param {Vevet.Plugin.Properties} [data] - Object of data to construct the class.
     */
    constructor(data) {
        super(data, false);
    }

    /**
     * @member Vevet.Plugin#defaultProp
     * @memberof Vevet.Plugin
     * @readonly
     * @type {Vevet.Plugin.Properties}
     */

    /**
     * @member Vevet.Plugin#prop
     * @memberof Vevet.Plugin
     * @readonly
     * @type {Vevet.Plugin.Properties}
     */

    /**
     * @member Vevet.Plugin#_prop
     * @memberof Vevet.Plugin
     * @protected
     * @type {Vevet.Plugin.Properties}
     */

    /**
     * @function Vevet.Plugin#changeProp
     * @memberof Vevet.Plugin
     * @param {Vevet.Plugin.Properties} [prop]
     */


    
    /**
     * @description Initialize the plugin.
     * @param {Vevet.Module} module - The module.
     */
    init(module) {

        /**
         * @description The module itself.
         * @member {Vevet.Module}
         * @protected
         */
        this._m = module;

        // initialize
        this._init();

    }



}