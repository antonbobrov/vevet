import Module from './Module';
import merge from './merge';
import timeoutCallback from './timeoutCallback';
const selectEl = require('select-el');

/**
 * @classdesc A class for changing pages on ajax requests. It manipulates pages created with the help of {@linkcode Vevet.PageModule}.
 * While initializing the class, links with the selector 'selectorLinks' are searched and when they are clicked on, ajax request is launched, which receives HTML data of the page and decides what page to create and show. <br>
 * Available targets:
 *  <ul>
 *      <li>click - when a link is clicked.  Each event will receive {@linkcode Vevet.PageAjaxModule.EventLinkHref} as an argument.</li>
 *      <li>popstate - event on popstate. Each event will receive {@linkcode Vevet.PageAjaxModule.EventHref} as an argument.</li>
 *      <li>clickSame - when a link, which href is equal to the current page URL, is clicked. Each event will receive {@linkcode Vevet.PageAjaxModule.EventLinkHref} as an argument.</li> 
 *      <li>prepare - before the request is launched. Each event will receive {@linkcode Vevet.PageAjaxModule.EventLinkHref} as an argument.</li>
 *      <li>loaded - when new content is loaded. Each event will receive {@linkcode Vevet.PageAjaxModule.EventLoaded} as an argument.</li>
 *      <li>updated - when the content is updated. Each event will receive {@linkcode Vevet.PageAjaxModule.EventLoaded} as an argument.</li>
 *      <li>done - when {@linkcode Vevet.PageAjaxModule#loading} becomes false. Each event will receive {@linkcode Vevet.PageAjaxModule.EventLoaded} as an argument.</li>
 *  </ul>
 * <br><br> <b>import {PageAjaxModule} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class PageAjaxModule extends Module {


    
    /**
     * @memberof Vevet.PageAjaxModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors] - ***
     * @property {string|HTMLElement} [selectors.outer=.vevet-pageAjax] - The outer in which pages will be changed.
     * The outer element must contain the attribute "data-vevet-pageAjax-name" 
     * to define the name of the page {@linkcode Vevet.PageModule}.
     * @property {string} [selectors.links=.vevet-pageAjax__link] - Links on which event listeners 
     * will be set.
     *
     * @property {object} [popstate]
     * @property {boolean} [popstate.event=true] - Defines if we need to load a new page thru ajax on popstate change.
     * @property {boolean} [popstate.reload=true] - If true, the page will be reloaded after popstate change in case {@linkcode popstate.event} is false.
     * @property {number} [popstate.timeout=300]
     * 
     * @property {boolean} [on=true] - If false, {@linkcode Vevet.PageAjaxModule#load} will return 'false'.
     * @property {boolean} [disabled=false] - If true, all listeners will be ignored.
     * 
     * @property {object} [update]
     * @property {boolean} [update.url=true]
     * @property {boolean} [update.title=true]
     * @property {object} [update.content=true]
     * 
     * @property {object} [menuLinks] - Update menu links.
     * @property {boolean} [menuLinks.update=true] - If true, {@linkcode menuLinks.class} will be added to active links and it will be removed from none-active ones.
     * @property {string} [menuLinks.class=active] - Name of the class for active links.
     * @property {string} [menuLinks.compare=href] - The attribute that will help to match old and new links.
     * @property {string} [menuLinks.selectorNew=.menu a]
     * @property {string} [menuLinks.selectorOld=.menu a]
     * 
     * @property {object} [timeouts]
     * @property {number} [timeouts.load=100] - Timeout before an ajax request will be sent.
     * @property {number} [timeouts.update=100] - Timeout before the content will be updated after its loaded.
     * @property {number} [timeouts.done=100] - Timeout before {@linkcode Vevet.PageAjaxModule#loading} will be false 
     * and events under the target 'done' will be launched.
     * 
     * @property {object} [pageChange] - Moments of changes of states of a page {@linkcode Vevet.PageModule}.
     * Possible values are targets of this class. F.e., if {@linkcode page.hide=='prepare'},
     * the current page will be automatically hidden when events under the target 'prepare' are launched.
     * @property {boolean} [pageChange.on=true] - Defines if you want to change pages automatically.
     * @property {string} [pageChange.default=default] - The name of a default page.
     * @property {string} [pageChange.hide=prepare] - {@linkcode Vevet.PageModule#hide}.
     * @property {string} [pageChange.destroy=loaded] - {@linkcode Vevet.PageModule#destroy}
     * @property {string} [pageChange.create=updated] - {@linkcode Vevet.PageModule#create}
     * @property {string} [pageChange.show=done] - {@linkcode Vevet.PageModule#show}
     * 
     * @property {boolean} [cache=false] - If we need to store ajax responses in cache {@linkcode Vevet.AJAXEvent#cache}.
     * 
     * @property {boolean} [changeSame=true] - Defines if a new page with the same URL can be loaded.
     * 
     * @property {object} [ajax] - Ajax requests.
     * @property {string} [ajax.method=post] - Method of xhr requests.
     * @property {Array<number>} [ajax.successCodes=[404]] - List of response codes that will not be accepted as errors. Otherwise the page will be reloaded.
     * 
     */
    /**
     * @alias Vevet.PageAjaxModule
     * 
     * @param {Vevet.PageAjaxModule.Properties} [data]
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}pageAjax`;
    }

    /**
     * @readonly
     * @type {Vevet.PageAjaxModule.Properties}
     */
    get defaultProp() {
        
        return merge(super.defaultProp, {
            selectors: {
                outer: `.${this._prefix}`,
                links: `.${this._prefix}__link`
            },
            popstate: {
                event: true,
                reload: true,
                timeout: 300
            },
            on: true,
            disabled: false,
            update: {
                url: true,
                title: true,
                content: true
            },
            menuLinks: {
                update: true,
                class: 'active',
                compare: 'href',
                selectorNew: '.menu a',
                selectorOld: '.menu a'
            },
            timeouts: {
                load: 100,
                update: 100,
                done: 100
            },
            pageChange: {
                on: true,
                default: 'default',
                hide: 'prepare',
                destroy: 'loaded',
                create: 'updated',
                show: 'done'
            },
            changeSame: true,
            cache: false,
            ajax: {
                method: 'post',
                successCodes: [404]
            }
        });

    }

    /**
     * @member Vevet.PageAjaxModule#prop
     * @memberof Vevet.PageAjaxModule
     * @readonly
     * @type {Vevet.PageAjaxModule.Properties}
     */

    /**
     * @member Vevet.PageAjaxModule#_prop
     * @memberof Vevet.PageAjaxModule
     * @protected
     * @type {Vevet.PageAjaxModule.Properties}
     */

    /**
     * @function Vevet.PageAjaxModule#changeProp
     * @memberof Vevet.PageAjaxModule
     * @param {Vevet.PageAjaxModule.Properties} [prop]
     */



    /**
     * @description Get links.
     * @readonly
     * @type {Array<HTMLAnchorElement>}
     */
    get links() {
        return this._links;
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
     * @description If something is being loaded.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get loading() {
        return this._loading;
    }



    // Extra Constructor
    _extra() {

        super._extra();

        /**
         * @description Data attribute names.
         * @member {object}
         * @private
         */
        this._data = {
            proceeded: `data-${this._prefix}-proceeded`,
            name: `data-${this._prefix}-name`
        };

        // vars
        this._loading = false;
        this._links = [];

        this._popstateTimeout = false;
        this._linksListeners = [];

        /**
         * @type {Vevet.PageAjaxModule.EventLoaded}
         * @protected
         */
        this._lastData = {};

        /**
         * @description A list of visited links.
         * @protected
         * @type {Array<string>}
         */
        this._visitedLinks = [window.location.href];

        // get outer
        this._outer = selectEl.one(this._prop.selectors.outer);

        // get elements
        this.setLinks();

    }



    // Set event listeners
    _setEvents() {

        // popstate
        this.listener(window, "popstate", this._popstate.bind(this));

    }



    /**
     * @description Get links and set event listeners on them,
     * but remove listeners from previous links before.
     */
    setLinks() {

        // remove old event listeners
        this._removeLinksListeners();

        // get new links
        this._links = selectEl.all(this._prop.selectors.links);
        // and set events on them
        this._addLinksListeners();

    }
    
    /**
     * @description Add event listeners on links.
     * @private
     */
    _addLinksListeners() {

        let proceeded = this._data.proceeded;
        this._links.forEach(link => {

            // check if not set yet
            if (typeof link[proceeded] == 'undefined') {

                let e = this.listener(link, 'click', this.load.bind(this, {
                    link: link,
                    push: true,
                    popstate: false
                }));
                this._linksListeners.push(e);

                link[proceeded] = true;

            }

        });

    }
    
    /**
     * @description Remove listeners from links.
     * @private
     */
    _removeLinksListeners() {

        this._linksListeners.forEach(listener => {
            this.removeEventListener({
                el: listener.el,
                id: listener.id
            });
            delete listener.el[this._data.proceeded];
        });
        
        this._linksListeners = [];

    }



    /**
     * @description Popstate event
     * @private
     */
    _popstate() {

        let prop = this._prop.popstate;

        if (!prop.event) {
            if (prop.reload) {
                window.location.reload();
            }
            return;
        }
        
        this._popstateLoad();

    }

    /**
     * @memberof Vevet.PageAjaxModule
     * @typedef {object} EventHref
     * @property {string} href - The url of the further ajax request.
     */

    /**
     * @description Load on popstate.
     * @private
     */
    _popstateLoad() {

        let prop = this._prop;

        // clear timeout
        if (this._popstateTimeout) {
            clearTimeout(this._popstateTimeout);
            this._popstateTimeout = false;
        }

        // check if available and then load
        if (!this._loading & !prop.disabled) {
            this._popstateTimeout = setTimeout(this._popstateForceLoad.bind(this), prop.popstate.timeout);
        }
        // timeouts and callbacks if not available
        else {
            if (this._loading) {
                this._popstateTimeout = setTimeout(this._popstateBusyLoad.bind(this), prop.popstate.timeout);
            }
        }

    }

    /**
     * @description Popstate force load.
     * @private
     */
    _popstateForceLoad() {

        this._pageChange('popstate');
        this.lbt('popstate', {
            href: window.location.href
        });
        this.load({
            link: window.location.href,
            push: false,
            popstate: true
        });

    }

    /**
     * @description Popstate event when loading or disabled.
     * @private
     */
    _popstateBusyLoad() {

        this.on("done", () => {
            this._popstateLoad();
        }, {
            once: true
        });

    }



    /**
     * @memberof Vevet.PageAjaxModule
     * @typedef {object} EventLinkHref
     * @property {string} href - The url of the further ajax request.
     * @property {HTMLAnchorElement|string} link - The link that was clicked or url passed.
     * @property {boolean} visited - If the page was already visited.
     */
    /**
     * @description Page loading.
     * 
     * @param {object} data 
     * @param {HTMLAnchorElement|string} data.link - Either an html element or a url string.
     * @param {boolean} [data.push=true] - Defines if you need to push the new url to the history.
     * @param {boolean} [data.popstate=false] - Defines if the action is called on popstate.
     * @param {object} [e=null] - Event data. It is not needed if the method is called not on a click.
     * 
     * @returns {boolean} Returns true if the action is successful.
     */
    load(data, e = null) {

        let props = this._prop;

        // check if enabled
        if (!props.on) {
            return false;
        }
        else {
            // check if link
            let hasTarget = false;
            if (data.link instanceof HTMLAnchorElement) {
                if (data.link.getAttribute("target")) {
                    hasTarget = true;
                }
            }
            // prevent default event if target doesn't exist
            if (e != null & !hasTarget) {
                e.preventDefault();
            }
        }

        // check if loading
        if (this._loading) {
            return false;
        }
        // check if disabled
        if (props.disabled) {
            return false;
        }

        // extend data
        let prop = {
            push: true,
            popstate: false
        };
        data = merge(prop, data);

        // get href
        let href = this._getHref(data.link);
        if (!href) {
            return false;
        }

        // check host
        if (!href.includes(window.location.host)) {
            window.location.href = href;
            return false;
        }

        // callback object
        let callbackObj = {
            href: href,
            link: data.link,
            visited: this._visitedLinks.includes(href)
        };

        // if the href is the same
        if (!props.changeSame & !data.popstate) {
            if (href == location.href) {
                this._pageChange('clickSame');
                this.lbt("clickSame", callbackObj);
                return false;
            }
        }

        // change states
        this._loading = true;

        // click event
        this._pageChange('click');
        this.lbt('click', callbackObj);

        // prepare event
        this._pageChange('prepare');
        this.lbt('prepare', callbackObj);

        // ajax load
        timeoutCallback(() => {
            this._loadAjax(data, href);
        }, props.timeouts.load);

        return true;

    }
    
    /**
     * @description Get href.
     * @param {HTMLAnchorElement|string} link - Either an html element or a url string.
     * @private
     */
    _getHref(link) {

        if (typeof link === 'string') {
            if (!link.includes("http")) {
                link = location.origin + link;
            }
            return link;
        }
        else {
            
            if (link instanceof HTMLAnchorElement) {
                if (link.getAttribute("href")) {
                    return link.href;
                }
                else {
                    return false;
                }
            }
            else{
                return false;
            }

        }

    }



    /**
     * @description Load page through ajax.
     * 
     * @private
     * 
     * @param {object} data
     * @param {HTMLAnchorElement|string} data.link - Either html element or url itself.
     * @param {boolean} data.push - Defines if you need to push the new url to the history.
     * @param {boolean} data.popstate - Defines if the action is called on popstate.
     * @param {string} href  - Url.
     */
    _loadAjax(data, href) {

        let prop = this._prop;

        this._v.ajax.load({
            url: href,
            method: prop.ajax.method,
            data: {
                pageAjax: 1
            },
            cache: prop.cache,
            success: this._loadSuccess.bind(this, data, href),
            abort: this._loadAjax.bind(this, data, href),
            error: this._loadError.bind(this, data, href)
        });

    }



    /**
     * @description When a new page is successfully loaded.
     * 
     * @private
     * 
     * @param {object} data
     * @param {HTMLAnchorElement|string} data.link - Either html element or url itself.
     * @param {boolean} data.push - Defines if you need to push the new url to the history.
     * @param {boolean} data.popstate - Defines if the action is called on popstate.
     * @param {string} href  - Url.
     * @param {Vevet.AJAXEvent.CacheItem} ajax - Ajax request & response data.
     */
    _loadSuccess(data, href, ajax) {

        this._visitedLinks.push(href);

        this._update(data, href, ajax);

    }

    /**
     * @description When a new page is not loaded.
     * 
     * @private
     * 
     * @param {object} data
     * @param {HTMLAnchorElement|string} data.link - Either html element or url itself.
     * @param {boolean} data.push - Defines if you need to push the new url to the history.
     * @param {boolean} data.popstate - Defines if the action is called on popstate.
     * @param {string} href  - Url.
     * @param {Vevet.AJAXEvent.CacheItem} ajax - Ajax request & response data.
     */
    _loadError(data, href, ajax) {

        if (this._prop.ajax.successCodes.includes(ajax.xhr.status)) {
            this._loadSuccess(data, href, ajax);
        }
        else {
            window.location.href = href;
        }

    }



    /**
     * @memberof Vevet.PageAjaxModule
     * @typedef {object} EventLoaded
     * @property {Vevet.AJAXEvent.CacheItem} ajax - Ajax request & response data.
     * @property {string} response - HTML of the whole page.
     * @property {string} html - innerHTML of the new outer.
     * @property {HTMLElement} e - An abstract html element with new html.
     * @property {HTMLElement} outer - The new outer.
     * @property {string} name - The name of the page.
     * @property {boolean} push - Defines if you need to push the new url to the history.
     * @property {string} href - Url.
     * @property {boolean} popstate - Defines if the load was called on popstate change.
     */
    /**
     * @description Update values and contents.
     * 
     * @private
     * 
     * @param {object} data - Request info.
     * @param {HTMLAnchorElement|string} data.link
     * @param {boolean} data.push - Defines if you need to push the new url to the history.
     * @param {boolean} data.popstate - Defines if the action is called on popstate.
     * @param {string} href - Url.
     * @param {Vevet.AJAXEvent.CacheItem} ajax - Ajax request & response data.
     */
    _update(data, href, ajax) {

        // get properties
        let prop = this._prop,
            propOuterSelector = prop.selectors.outer;

        // create a new abstract html element
        let e = document.createElement("html");
        e.innerHTML = ajax.xhr.responseText;

        // get outer of the page
        let outer = e.querySelector(propOuterSelector);
        if (outer == null) {
            throw new Error(`There's no HTMLElement under the selector "${propOuterSelector}"`);
        }

        // get name of the page
        let name = outer.getAttribute(this._data.name);
        if (name == null) {
            throw new Error(`The outer "${propOuterSelector}" must contain the attribute "${this._data.name}"`);
        }
        
        // get new html
        let html = outer.innerHTML;

        // form object
        let obj = {
            ajax: ajax,
            response: ajax.xhr.responseText,
            html: html,
            outer: outer,
            name: name,
            e: e,
            push: data.push,
            href: href,
            popstate: data.popstate
        };

        // event loaded
        this._pageChange('loaded', name);
        this.lbt("loaded", obj);

        // update contents
        timeoutCallback(() => {

            this._updateContents(obj);

            // done
            timeoutCallback(() => {
                this._done(obj); 
            }, prop.timeouts.done);

            // clear html
            e = null;
              
        }, prop.timeouts.update);

    }

    /**
     * @description Update contents inside the window.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updateContents(data) {

        this._lastData = data;

        // update contents
        this._updateUrl(data);
        this._updateTitle(data);
        this._updateHTML(data);
        if (this._prop.menuLinks.update) {
            this._updateMenuLinks(data);
        }
        this._updatePageData(data);

        // launch callback

        this._pageChange('updated', data.name);
        this.lbt("updated", data);

    }

    /**
     * @description Update page url.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updateUrl(data) {

        if (this._prop.update.url & data.push) {
            window.history.pushState(null, "", data.href);
        }

    }

    /**
     * @description Update page title.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updateTitle(data) {

        if (this._prop.update.title) {

            let el = {
                old: document.querySelector("title"),
                new: data.e.querySelector("title")
            };

            if (el.old !== null & el.new !== null) {
                el.old.innerHTML = el.new.innerHTML;
            }

        }

    }

    /**
     * @description Update page html.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updateHTML(data) {

        if (this._prop.update.content) {
            this._outer.innerHTML = data.html;
            this.setLinks();
        }

    }

    /**
     * @description Update menu links.
     */
    updateMenuLinks() {

        if (Object.keys(this._lastData).length > 0) {
            this._updateMenuLinks(this._lastData);
        }
        
    }

    /**
     * @description Update menu links.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updateMenuLinks(data) {

        // get prop
        let menuLinks = this._prop.menuLinks;

        // get links
        let el = {
            old: document.querySelectorAll(menuLinks.selectorNew),
            new: data.e.querySelectorAll(menuLinks.selectorOld)
        };

        // compare them

        for (let i = 0; i < el.new.length; i++) {

            let elNew = el.new[i],
                attributeNew = elNew.getAttribute(menuLinks.compare),
                activeNew = elNew.classList.contains(menuLinks.class);

            for (let a = 0; a < el.old.length; a++) {

                let elOld = el.old[a],
                    attributeOld = elOld.getAttribute(menuLinks.compare);

                if (attributeNew === attributeOld) {
                    if (activeNew) {
                        elOld.classList.add(menuLinks.class);
                    }
                    else {
                        elOld.classList.remove(menuLinks.class);
                    }
                }
                
            }

        }

    }

    /**
     * @description Update current page data.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _updatePageData(data) {

        this._outer.setAttribute(this._data.name, data.name);
        this._v.page = [data.name];

    }



    /**
     * @description End the process.
     * @private
     * @param {Vevet.PageAjaxModule.EventLoaded} data - Ajax data.
     */
    _done(data) {

        // change state
        this._loading = false;

        // launch callback

        this._pageChange('done', data.name);
        this.lbt("done", data);

    }



    /**
     * @description Change pages automatically.
     * @param {string} target - What callback is launched. See {@linkcode _prop.pageChange}.
     * @param {string} name - Name of the page.
     * @private
     */
    _pageChange(target, name = '') {

        // automatical changes
        let auto = this._prop.pageChange;

        // check if automatical change enabled
        if (!auto.on) {
            return;
        }

        // if need to hide
        if (target === auto.hide) {
            this._v.vevetPage.hide();
        }

        // if need to destroy
        if (target === auto.destroy) {
            this._v.vevetPage.destroy();
        }

        // if need to create
        if (target === auto.create) {

            let existingPage = false,
                defaultPage = false;

            for (let i = 0; i < this._v.vevetPages.length; i++) {
                let p = this._v.vevetPages[i];
                if (p.name == name) {
                    existingPage = p;
                }
                if (p.name == this._prop.pageChange.default) {
                    defaultPage = p;
                }
            }

            if (!existingPage) {
                if (!defaultPage) {
                    throw new Error("Default page doesn't exist!");
                }
                else {
                    defaultPage.create(true);
                }
            }
            else {
                existingPage.create(true);
            }

        }

        // if need to show
        if (target === auto.show) {
            this._v.vevetPage.show();
        }

    }



}