import Module from '../modules/Module';

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
     * @param {Vevet.Plugin.Properties} data - Object of data to construct the class.
     */
    constructor(data) {
        super(data, false);
    }


    
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