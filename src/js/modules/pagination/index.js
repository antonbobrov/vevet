const dom = require('dom-create-element');

import Module from '../Module';
import utils from '../../core/utils';

/**
 * @classdesc Ajax Pagination. <br>
 * Available targets:
 *  <ul>
 *      <li>load - {@linkcode Vevet.Pagination.Load} is an argument.</li>
 *      <li>last - {@linkcode Vevet.Pagination.Last} is an argument.</li>
 *      <li>paginationClick - {@linkcode Vevet.Pagination.Click} is an argument.</li>
 *  </ul>
 * <br><br> <b>import {Pagination} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class Pagination extends Module {


    
    /**
     * @memberof Vevet.Pagination
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {string|HTMLElement} [selector=vevet-pagination] - *** Selector of the outer element.
     * The element under the selector must contain the following attributes:
     *      <ul>
     *          <li>data-vevet-pagination-active - active, current page</li>
     *          <li>data-vevet-pagination-max - total amount of pages</li>
     *          <li>data-vevet-pagination-url - url for pagination</li> 
     *      </ul>
     * @property {string} [param=page] - URL parameter that changes when a new page is loaded.
     * 
     * @property {object} [update]
     * @property {boolean} [update.url=true] - Update the url address when a new page is loaded.
     * @property {boolean} [update.title=true] - Update the title of the page when a new page is loaded.
     * @property {boolean} [update.content=true] - Update content when a new page is loaded.
     * 
     * @property {object} [pagination]
     * @property {boolean} [pagination.on=true] - Enable pagination.
     * @property {number} [pagination.left=3] - How many links are shown on the left from the active one.
     * @property {number} [pagination.right=3] - How many links are shown on the left from the active one.
     * @property {boolean} [pagination.updateContent=true] - If true, after a click the content will be automatically changed. If false - new content will be added.
     * @property {number} [pagination.timeout=0] - How much time to wait before {@linkcode Vevet.Pagination#load} will be called.
     * 
     * @property {object} [popstate]
     * @property {boolean} [popstate.event=true] - Catch popstate event and load content of the current url.
     * @property {boolean} [popstate.reload=false] - Reload on popstate.
     * 
     * @property {object} [ajax] - Ajax settings.
     * @property {boolean} [ajax.cache=false] - Store data in cache.
     * @property {string} [ajax.method=post] - post or get.
     * 
     */
    /**
     * @alias Vevet.Pagination
     * 
     * @param {Vevet.Pagination.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}pagination`;
    }

    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            selector: `.${this._prefix}`,
            param: `page`,
            update: {
                url: true,
                title: true,
                content: true
            },
            pagination: {
                on: true,
                left: 3,
                right: 3,
                updateContent: true,
                timeout: 0
            },
            popstate: {
                event: true,
                reload: false
            },
            ajax: {
                cache: false,
                method: 'post'
            }
        });

    }



    /**
     * @memberof Vevet.Pagination
     * @typedef {object} Load
     * @property {boolean} pagination - If the action was carried out thru a pagination click.
     * @property {boolean} reload - If the action was carried out thru {@linkcode Vevet.Pagination#reload}.
     * @property {HTMLElement} outer - Elements' outer.
     * @property {string} fullHTML - The new page's html.
     * @property {string} html - The innerHTML of the outer.
     */
    /**
     * @memberof Vevet.Pagination
     * @typedef {object} Last
     * @property {HTMLElement} outer - Elements' outer.
     * @property {string} fullHTML - The new page's html.
     * @property {string} html - The innerHTML of the outer.
     */
    /**
     * @memberof Vevet.Pagination
     * @typedef {object} Click
     * @property {number} num - Order number of the anchor.
     * @property {HTMLElement} anchor - Anchor.
     */



    /**
     * @description Get active page.
     * @readonly
     * @type {number}
     */
    get active() {
        return this._active;
    }
    /**
     * @description Last page.
     * @readonly
     * @type {number}
     */
    get max() {
        return this._max;
    }
    /**
     * @description If content is loading.
     * @readonly
     * @type {boolean}
     */
    get loading() {
        return this._loading;
    }



    // Extra constructor
    _extra() {

        super._extra();

        let prefix = this._prefix;

        /**
         * @description Available data attributes.
         * @member {object}
         * @private
         */
        this._data = {
            active: `data-${prefix}-active`,
            max: `data-${prefix}-max`,
            url: `data-${prefix}-url`
        };

        // variables
        this._active = 1;
        this._max = 1;
        this._loading = false;

        // pagination elements
        this._pagination = null;

        // get elements
        this._elementsGet();

        // get url
        let urlAttribute = this._outer.getAttribute(this._data.url);
        if (urlAttribute != null) {
            this.url = urlAttribute;
        }
        else{
            this.url = window.location.href;
        }

        // actions
        this._range(this._outer);
        this._paginationCreate();
        this._paginationLinks();
        this._paginationActive();
        this._paginationVisibility();

    }

    // When properties are changed
    _changeProp(prop) {
        super._changeProp(prop);
        this._paginationVisibility();
        this._paginationLinks();
        this._paginationActive();
    }



    // Set events
    _setEvents() {

        // popstate event
        this.listener(window, "popstate", this._popstate.bind(this));

    }



    /**
     * @description Get elements
     * @private
     */
    _elementsGet() {

        this._outer = utils.element(this._prop.selector);

    }



    /**
     * @description Popstate events.
     * @private
     */
    _popstate() {

        let popstate = this._prop.popstate;

        if (!popstate.event) {
            if (popstate.reload) {
                window.location.reload();
            }
            return false;
        }
        
        this._popstateCatch();

    }

    /**
     * @description Catch popstate and load a new page.
     * @private
     */
    _popstateCatch() {

        // get active page according to the url
        let active = this._v.url.getParam({
            key: this._prop.param
        });
        if (active != null) {
            active = parseInt(active);
        }
        else {
            active = 1;
        }

        this.load({
            num: active,
            pushState: false,
            reload: true
        });

    }



    /**
     * @description Variables range: first and last page.
     * @param {HTMLElement} outer - Outer element.
     * @param {boolean} updateActive - If we need to update the active value.
     * @private
     */
    _range(outer, updateActive = true) {

        // check if outer exists
        if (!outer) {
            return;
        }

        let data = this._data;

        // get active
        if (updateActive) {
            this._active = this._rangeInt(outer, data.active);
        }
        
        // get max
        this._max = this._rangeInt(outer, data.max);

    }

    /**
     * @description Get range number.
     * @private
     * @param {HTMLElement} outer
     * @param {string} data
     */
    _rangeInt(outer, data) {
        
        let num = outer.getAttribute(data);
        num = parseInt(num);
        if (!Number.isInteger(num)) {
            num = 1;
        }
        else {
            if (num < 1) {
                num = 1;
            }
        }

        return num;

    }
    

    
    /**
     * @description Pagination links
     * @private
     */
    _paginationCreate() {
        
        let el = dom({
            selector: 'ul',
            styles: `${this._prefix}__ul`
        });
        utils.insertAfter(el, this._outer);

        this._pagination = el;

    }

    /**
     * @description Create pagination links.
     * @private
     */
    _paginationLinks() {
        
        // first of all, remove previous pagination links
        utils.removeChildren(this._pagination);

        // create or update pagination arrays
        this._paginationLi = [];
        this._paginationA = [];
        this._paginationDots = [];

        // create elements
        for (let i = 0; i < this._max; i++) {

            // list
            let li = dom({
                selector: 'li',
                styles: `${this.prefix}__li`
            });
            this._paginationLi.push(li);
            this._pagination.appendChild(li);

            // anchor
            let a = dom({
                selector: 'a',
            })
            li.appendChild(a);
            this._paginationA.push(a);
            
            // set anchor href
            let href = this._v.url.setParam({
                url: this.url,
                key: this._prop.param,
                value: (i + 1),
                push: false
            });
            a.href = href;

            // anchor text
            let text = i + 1;
            if (i < 9) {
                text = '0' + text;
            }
            a.innerHTML = `<span>${text}</span>`;

        }

        // show or hide pagination
        this._paginationVisibility();

        // show links
        this._paginationShown();
        this._paginationEvents();

    }

    /**
     * @description Sho pagination.
     * @private
     */
    _paginationShown() {

        // get shown links
        let shown = [0, this._max - 1];

        // add shown links
        for (let i = this._active - 1; i >= this._active - 1 - this._prop.pagination.left; i--) {
            shown.push(i);
        }
        for (let i = this._active - 1; i <= this._active - 1 + this._prop.pagination.left; i++) {
            shown.push(i);
        }

        // append dots
        for (let i = 0; i < this._paginationLi.length; i++) {
            let anchor = this._paginationA[i];
            if (!shown.includes(i)) {
                // set dot
                let li = this._paginationLi[i];
                li.classList.add(`${this.prefix}__dot`);
                this._paginationDots.push(li);
                // append dots
                let span = dom({
                    selector: 'span'
                });
                span.innerHTML = '...';
                li.appendChild(span);
                // hide anchor
                anchor.classList.add("display-none");
            }
            else {
                this._paginationDots.push(null);
            }
        }

        // hide extra dots
        for (let i = 0, a = 0; i < this._active; i++) {
            let dot = this._paginationDots[i];
            if (dot != null) {
                if (a > 0) {
                    dot.classList.add("display-none");
                }
                a++;
            }
        }
        for (let i = this._active - 1, a = 0; i < this._max - 1; i++) {
            let dot = this._paginationDots[i];
            if (dot != null) {
                if (a > 0) {
                    dot.classList.add("display-none");
                }
                a++;
            }
        }

    }

    /**
     * @description Set pagination events: clicks on links.
     * @private
     */
    _paginationEvents() {

        let i = 0;
        this._paginationA.forEach(el => {
            el.addEventListener("click", this._paginationClick.bind(this, el, i));
            i++;
        });

    }

    /**
     * @description Pagination click.
     * @private
     * @param {HTMLElement} el - Link.
     * @param {number} num
     * @param {object} e
     */
    _paginationClick(el, num, e) {

        // prevent default event
        e.preventDefault();

        // prevent event for active links
        if (el.parentElement.classList.contains(`${this.prefix}__li_active`)) {
            return;
        }

        // get page number
        num += 1;

        // launch vevet events
        this.launchByTarget("paginationClick", {
            num: num,
            anchor: el
        });

        // load content
        setTimeout(() => {
            this.load({
                num: num,
                pagination: true
            });
        }, this._prop.pagination.timeout);

    }

    /**
     * @description Set active link in pagination
     * @private
     * @param {number} [num]
     */
    _paginationActive(num = this.active) {

        let activeClass = `${this.prefix}__li_active`;

        num -= 1;
        for (let i = 0; i < this._paginationLi.length; i++) {
            let li = this._paginationLi[i];
            if (i !== num) {
                li.classList.remove(activeClass);
            }
            else {
                li.classList.add(activeClass);
            }
        }

    }

    /**
     * @description Pagination visibility: hide or show.
     * @private
     */
    _paginationVisibility() {

        let visible = true;
        
        if (this._max === 1) { 
            visible = false;
        }
        
        if (!this._prop.pagination.on) { 
            visible = false;
        }

        let className = "display-none_important";
        if (visible) {
            this._pagination.classList.remove(className);
        }
        else {
            this._pagination.classList.add(className);
        }

    }



    /**
     * @description Load a new page.
     * @param {object} data - Settings.
     * @param {number|boolean} data.num - The order number of the page, or true (next page), or false (previous page).
     * @param {boolean} [data.pagination=false] - Defines if the action was called due a pagination click.
     * @param {boolean} [data.reload=false] - If thru {@linkcode Vevet.Pagination#reload}.
     * @param {boolean} [data.pushState=true] - Defines if you need to change the url.
     * @returns {boolean} Returns true if the action can be carried out.
     */
    load(data) {

        // data
        data = Object.assign({
            pagination: false,
            reload: false,
            pushState: true
        }, data);

        // get order number
        if (typeof data.num == 'boolean') {
            if (data.num) {
                data.num = this._active + 1;
            }
            else {
                data.num = this._active - 1;
            }
        }

        // check if possible
        if (!this._loadCheck(data.num)) {
            return false;
        }

        // change bool
        this._loading = true;

        // update url if needed
        this.url = this._v.url.setParam({
            url: this.url,
            key: this._prop.param,
            value: data.num,
            push: this._prop.update.url & data.pushState
        });

        // load the resource
        this._loadAjax(data.reload, data.num, data.pagination);

        // return success
        return true;

    }

    /**
     * @description Check if loading is available.
     * @param {number} num - The order number of the page to be loaded.
     * @returns {boolean} Returns true if available.
     * @private
     */
    _loadCheck(num = this._active) {

        if (this._loading) {
            return false;
        }
        if (num > this._max) {
            return false;
        }
        if (num > this._max) {
            return false;
        }

        return true;

    }

    /**
     * @description Load a new page.
     * @param {boolean} reload - If thru {@linkcode Vevet.Pagination#reload}.
     * @param {number} num - The order number of the page to be loaded.
     * @param {boolean} pagination - Defines if the action was called due a pagination click.
     * @private
     */
    _loadAjax(reload, num, pagination) {

        this._v.ajax.load({
            url: this.url,
            method: this._prop.ajax.method,
            data: {
                pagination: 1
            },
            cache: this._prop.ajax.cache,
            success: this._loadSuccess.bind(this, reload, num, pagination),
            abort: this._loadAjax.bind(this, reload, num, pagination),
            error: this._loadError.bind(this)
        });

    }

    /**
     * @description If error while loading.
     * @private
     */
    _loadError() {
    }

    /**
     * @description Success loading of the new page.
     * @param {boolean} reload - If thru {@linkcode Vevet.Pagination#reload}.
     * @param {number} num - The order number of the page to be loaded.
     * @param {boolean} pagination - Defines if the action was called due a pagination click.
     * @param {Vevet.Ajax.CacheItem} data - Ajax response.
     * @private
     */
    _loadSuccess(reload, num, pagination, data) {
       
        // create additional element
        let e = dom({
            selector: 'div'
        });
        e.innerHTML = data.xhr.response;

        // update title
        if (this._prop.update.title) {
            let el = {
                current: document.querySelector("title"),
                new: e.querySelector("title")
            };
            if (el.current != null & el.new != null) {
                el.current.innerHTML = el.new.innerHTML;
            }
        }

        // outer
        let outers = {
            current: this._outer,
            new: e.querySelector(this._prop.selector)
        };
        if (outers.new == null) {
            return;
        }
        e = null;

        // html
        let html = outers.new.innerHTML;

        // update content
        if (this._prop.update.content) {
            if (!reload) {
                if (pagination) {
                    if (this._prop.pagination.updateContent) {
                        utils.removeChildren(outers.current);
                        outers.current.innerHTML = html;
                    }
                    else {
                        for (let i = 0; i < outers.new.children.length; i++) {
                            outers.current.appendChild(outers.new.children[i]);
                        }
                    }
                }
                else {
                    for (let i = 0; i < outers.new.children.length; i++) {
                        outers.current.appendChild(outers.new.children[i]);
                    }
                }
            }
            else {
                utils.removeChildren(outers.current);
                outers.current.innerHTML = html;
            }
        }
        
        // get range
        this._range(outers.new, false);
        this._active = num;

        // callbacks
        this.launchByTarget("load", {
            pagination: pagination,
            reload: reload,
            outer: this._outer,
            fullHTML: data.xhr.response,
            html: html
        });
        if (this.active >= this.max) {
            this.launchByTarget("last", {
                outer: this._outer,
                fullHTML: data.xhr.response,
                html: html
            });
        }

        // update pagination
        this._paginationLinks();
        this._paginationActive();

        // loading
        this._loading = false;
        
    }



    /**
     * @description Reload the content.
     * @param {boolean} [pushState=true] - Defines if you need to change the url.
     * @param {boolean} [changeActive=true] - Defines if you need to change the active page.
     * @returns {boolean} Returns true if the action can be carried out.
     */
    reload(pushState = true, changeActive = true) {

        // check if possible
        if (!this._loadCheck()) {
            return false;
        }

        // change active value
        if (changeActive) {
            this._active = 1;
        }

        // load
        return this.load({
            num: this._active, 
            reload: true,
            pushState: pushState
        });

    }



    /**
     * @description Destroy the select.
     */
    destroy() {

        super.destroy();

        // remove pagination
        this._pagination.remove();
        
    }



}