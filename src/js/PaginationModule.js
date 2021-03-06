const dom = require('dom-create-element');
const selectEl = require('select-el');

import Module from './Module';
import merge from './merge';
import domInsertAfter from './domInsertAfter';
import domRemoveChildren from './domRemoveChildren';

/**
 * @classdesc Ajax Pagination. <br>
 * Available targets:
 *  <ul>
 *      <li>load - {@linkcode Vevet.PaginationModule.Load} is an argument.</li>
 *      <li>last - {@linkcode Vevet.PaginationModule.Last} is an argument.</li>
 *      <li>paginationClick - {@linkcode Vevet.PaginationModule.Click} is an argument.</li>
 *  </ul>
 * <br><br> <b>import {PaginationModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.PaginationModule : load : Vevet.PaginationModule.Load}
 * @vevetModuleCallback { Vevet.PaginationModule : last : Vevet.PaginationModule.Last}
 * @vevetModuleCallback { Vevet.PaginationModule : paginationClick : Vevet.PaginationModule.Click}
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class PaginationModule extends Module {


    
    /**
     * @memberof Vevet.PaginationModule
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
     * @property {number} [pagination.timeout=0] - How much time to wait before {@linkcode Vevet.PaginationModule#load} will be called.
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
     * @alias Vevet.PaginationModule
     * 
     * @param {Vevet.PaginationModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}pagination`;
    }

    /**
     * @readonly
     * @type {Vevet.PaginationModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
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
     * @member Vevet.PaginationModule#prop
     * @memberof Vevet.PaginationModule
     * @readonly
     * @type {Vevet.PaginationModule.Properties}
     */

    /**
     * @member Vevet.PaginationModule#_prop
     * @memberof Vevet.PaginationModule
     * @protected
     * @type {Vevet.PaginationModule.Properties}
     */

    /**
     * @function Vevet.PaginationModule#changeProp
     * @memberof Vevet.PaginationModule
     * @param {Vevet.PaginationModule.Properties} [prop]
     */



    /**
     * @memberof Vevet.PaginationModule
     * @typedef {object} Load
     * @property {boolean} pagination - If the action was carried out thru a pagination click.
     * @property {boolean} reload - If the action was carried out thru {@linkcode Vevet.PaginationModule#reload}.
     * @property {HTMLElement} outer - Elements' outer.
     * @property {string} fullHTML - The new page's html.
     * @property {string} html - The innerHTML of the outer.
     */
    /**
     * @memberof Vevet.PaginationModule
     * @typedef {object} Last
     * @property {HTMLElement} outer - Elements' outer.
     * @property {string} fullHTML - The new page's html.
     * @property {string} html - The innerHTML of the outer.
     */
    /**
     * @memberof Vevet.PaginationModule
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
    /**
     * @description Outer element.
     * @readonly
     * @type {HTMLElement}
     */
    get outer() {
        return this._outer;
    }
    /**
     * @description Pagination UL element.
     * @readonly
     * @type {HTMLUListElement}
     */
    get pagination() {
        return this._pagination;
    }
    /**
     * @description Current URL.
     * @readonly
     * @type {string}
     */
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }



    // Extra constructor
    _extra() {

        super._extra();

        let prefix = this._prefix;

        /**
         * @description Available data attributes.
         * @member {object}
         * @protected
         */
        this._data = {
            active: `data-${prefix}-active`,
            max: `data-${prefix}-max`,
            url: `data-${prefix}-url`
        };

        /**
         * @description Active page number.
         * @protected
         * @member {number}
         */
        this._active = 1;
        /**
         * @description Maximum number of pages.
         * @protected
         * @member {number}
         */
        this._max = 1;
        /**
         * @description If content is loading.
         * @protected
         * @member {boolean}
         */
        this._loading = false;

        /**
         * @description Pagination UL element.
         * @protected
         * @member {HTMLUListElement}
         */
        this._pagination = null;

        // get elements
        this._elementsGet();

        /**
         * @description Current URL.
         * @protected
         * @member {string}
         */
        this._url;

        // get url
        let urlAttribute = this._outer.getAttribute(this._data.url);
        if (urlAttribute != null) {
            this._url = urlAttribute;
        }
        else{
            this._url = window.location.href;
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
     * @protected
     */
    _elementsGet() {

        this._outer = selectEl.one(this._prop.selector);

    }



    /**
     * @description Popstate events.
     * @protected
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
     * @protected
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
     * @protected
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
     * @protected
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
     * @protected
     */
    _paginationCreate() {
        
        let el = dom({
            selector: 'ul',
            styles: `${this._prefix}__ul`
        });
        domInsertAfter(el, this._outer);

        this._pagination = el;

    }

    /**
     * @description Create pagination links.
     * @protected
     */
    _paginationLinks() {
        
        // first of all, remove previous pagination links
        domRemoveChildren(this._pagination);

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
                url: this._url,
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
     * @protected
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
     * @protected
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
     * @protected
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
        this.lbt("paginationClick", {
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
     * @protected
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
     * @protected
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
     * @param {number|boolean} [data.num=true] - The order number of the page, or true (next page), or false (previous page).
     * @param {boolean} [data.pagination=false] - Defines if the action was called due a pagination click.
     * @param {boolean} [data.reload=false] - If thru {@linkcode Vevet.PaginationModule#reload}.
     * @param {boolean} [data.pushState=true] - Defines if you need to change the url.
     * @returns {boolean} Returns true if the action can be carried out.
     */
    load(data) {

        // data
        data = Object.assign({
            num: true,
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
            url: this._url,
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
     * @protected
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
     * @param {boolean} reload - If thru {@linkcode Vevet.PaginationModule#reload}.
     * @param {number} num - The order number of the page to be loaded.
     * @param {boolean} pagination - Defines if the action was called due a pagination click.
     * @protected
     */
    _loadAjax(reload, num, pagination) {

        this._v.ajax.load({
            url: this._url,
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
     * @protected
     */
    _loadError() {
    }

    /**
     * @description Success loading of the new page.
     * @param {boolean} reload - If thru {@linkcode Vevet.PaginationModule#reload}.
     * @param {number} num - The order number of the page to be loaded.
     * @param {boolean} pagination - Defines if the action was called due a pagination click.
     * @param {Vevet.AJAXEvent.CacheItem} data - Ajax response.
     * @protected
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
                        domRemoveChildren(outers.current);
                        outers.current.innerHTML = html;
                    }
                    else {
                        while (outers.new.firstChild) {
                            outers.current.appendChild(outers.new.firstChild);
                        }
                    }
                }
                else {
                    while (outers.new.firstChild) {
                        outers.current.appendChild(outers.new.firstChild);
                    }
                }
            }
            else {
                domRemoveChildren(outers.current);
                outers.current.innerHTML = html;
            }
        }
        
        // get range
        this._range(outers.new, false);
        this._active = num;

        // callbacks
        this.lbt("load", {
            pagination: pagination,
            reload: reload,
            outer: this._outer,
            fullHTML: data.xhr.response,
            html: html
        });
        if (this.active >= this.max) {
            this.lbt("last", {
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
     * @description Destroy the module.
     */
    destroy() {

        super.destroy();

        // remove pagination
        this._pagination.remove();
        
    }



}