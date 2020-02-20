const dom = require('dom-create-element');

import Module from './Module';
import merge from './merge';
const selectEl = require('select-el');

/**
 * @classdesc Split your content into as many columns as you want. <br>
 * <br><br> <b>import {Columns} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class ModuleColumns extends Module {


    
    /**
     * @memberof Vevet.ModuleColumns
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors] - *** An object with css selectors.
     * @property {string|HTMLElement} [selectors.outer=.vevet-columns] - The outer with items.
     * @property {string} [selectors.item=.vevet-columns__item] - Elements that will be split inside the outer.
     * 
     * @property {Array<number>} [columns=[0, 1, 2]] - The array that defines quantity and order of columns. F.e., you can set [0, 1, 2], [2, 0, 1] etc.
     */
    /**
     * @alias Vevet.ModuleColumns
     * 
     * @param {Vevet.ModuleColumns.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}columns`;
    }

    /**
     * @readonly
     * @type {Vevet.ModuleColumns.Properties}
     */
    get defaultProp() {
        let prefix = this._prefix;
        return merge(super.defaultProp, {
            selectors: {
                outer: '.' + prefix,
                item: '.' + prefix + '__item'
            },
            columns: [0, 1, 2]
        });
    }

    /**
     * @member Vevet.ModuleColumns#prop
     * @memberof Vevet.ModuleColumns
     * @readonly
     * @type {Vevet.ModuleColumns.Properties}
     */

    /**
     * @member Vevet.ModuleColumns#_prop
     * @memberof Vevet.ModuleColumns
     * @protected
     * @type {Vevet.ModuleColumns.Properties}
     */

    /**
     * @function Vevet.ModuleColumns#changeProp
     * @memberof Vevet.ModuleColumns
     * @param {Vevet.ModuleColumns.Properties} [prop]
     */



    /**
     * @description Get columns.
     * @readonly
     * @member {Array<HTMLElement>}
     */
    get columns() {
        return this._columns;
    }
    /**
     * @description Get elements inside the columns.
     * @readonly
     * @type {Array<HTMLElement>}
     */
    get items() {
        return this._items;
    }



    // Extra constructor
    _extra() {

        super._extra();

        /**
         * @description Columns.
         * @member {Array<HTMLElement>}
         * @private
         */
        this._columns = [];

        // vars
        this._lastColumn = 0;

        // get elements
        this._getElements();

        // init columns
        this._columnsInit()

    }

    // Change Properties
    _changeProp() {

        super._changeProp();

        if (JSON.stringify(this._columnsPrev) != JSON.stringify(this._prop.columns)) {
            this._columnsInit();
        }

    }


    // Get elements
    _getElements() {

        let prop = this._prop;
        
        // form itself
        this._outer = selectEl.one(prop.selectors.outer);
        let outer = this._outer;
        outer.classList.add(`${this._prefix}`);
        
        // elements
        this._items = outer.querySelectorAll(prop.selectors.item);

    }



    // Split into columns
    _columnsInit() {

        this._itemsToParent();
        this._columnsRemove();
        this._columnsAdd();
        this._itemsToColumns();
        this._columnsRemember();

    }

    /**
     * @description Remove columns.
     * @private
     */
    _columnsRemove() {

        let outer = this._outer,
            columns = this._columns;

        // remove class
        outer.classList.remove(`${this._prefix}_${columns.length}`);

        // remove columns
        for (let i = 0; i < columns.length; i++) {
            outer.removeChild(columns[i]);
        }

        // reset vars
        this._columns = [];
        this._lastColumn = 0;

    }

    /**
     * @description Add columns.
     * @private
     */
    _columnsAdd() {

        let outer = this._outer,
            prefix = this._prefix;

        // add class
        outer.classList.add(`${prefix}_${this._prop.columns.length}`);

        // create columns
        this._prop.columns.forEach(num => {
            let column = dom({
                selector: 'div',
                styles: `${prefix}__column ${prefix}__column_${num}`
            });
            outer.appendChild(column);
            this._columns.push(column);
        });

    }

    /**
     * @description Save columns data.
     * @private
     */
    _columnsRemember() {
        this._columnsPrev = this._prop.columns.slice();
    }



    
    /**
     * @description Move all items to the parent.
     * @private
     */
    _itemsToParent() {

        this._items.forEach(el => {
            this._outer.appendChild(el);
        });

    }

    /**
     * @description Split items into columns.
     * @private
     * @param {Array<HTMLElement>} items
     */
    _itemsToColumns(items = this._items) {

        let last = 0;

        // if additional items

        if (items !== this._items) {
            last = this._lastColumn + 1;
            if (last >= this._prop.columns.length) {
                last = 0;
            }            
        }

        // insert items

        for (let i = 0, a = last; i < items.length; a++, i++) {

            let num = this._prop.columns[a];
            this._columns[num].appendChild(items[i]);

            this._lastColumn = a;
            if(a >= this._prop.columns.length - 1){
                a = -1;
            }

        }

    }



    /**
     * @description Add HTML to the columns. The HTML string must contain items with the item selector.
     * @param {string} html - HTML.
     */
    addHTML(html) {

        // get html
        let el = document.createElement("html");
        el.innerHTML = html;

        // add items
        let items = el.querySelectorAll(this._prop.selectors.item);
        for (let i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }

    }

    /**
     * @description Add an item to the columns.
     * @param {HTMLElement} el - HTML element.
     */
    addItem(el) {

        this._itemsToColumns([el]);

    }

    /**
     * @description Add items to the columns.
     * @param {Array<HTMLElement>} el - Array of HTML element.
     */
    addItems(el) {

        this._itemsToColumns(el);

    }



    /**
     * @description Destroy the class.
     */
    destroy() {

        super.destroy();

        // remove classes
        this._outer.classList.remove(`${this._prefix}`);

        // remove columns
        this._itemsToParent();
        this._columnsRemove();
        
    }



}