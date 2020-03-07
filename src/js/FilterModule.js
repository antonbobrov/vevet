import Module from './Module';
import merge from './merge';
import generateId from './generateId';
const selectEl = require('select-el');

/**
 * @classdesc This class is to create filters. It works together with {@linkcode Vevet.PaginationModule} <br>
 * Available targets:
 *  <ul>
 *      <li>popstate - argument {@linkcode Vevet.FilterModule.PopstateCallback }</li>
 *      <li>save</li>
 *  </ul>
 * <br><br> <b>import {FilterModule} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.FilterModule : popstate : Vevet.FilterModule.PopstateCallback }
 * @vevetModuleCallback { Vevet.FilterModule : save :  }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Module
 */
export default class FilterModule extends Module {


    
    /**
     * @memberof Vevet.FilterModule
     * @typedef {object} Properties
     * @augments Vevet.Module.Properties
     * 
     * @property {object} [selectors] - ***
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.group=.vevet-filter__group] - Group of filters.
     * Each group must/may have the following data attributes:
     * <ul>
     *      <li>data-vevet-filter-group - the name (id) of the group</li>
     *      <li>data-vevet-filter-multiple - an optional attribute which defines that several filters 
     *      may be active within one group. By default, none of the groups are multiple.</li>
     * </ul>
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.filter=.vevet-filter__filter] - Filter elements.
     * Each element must have the following data attributes:
     * <ul>
     *      <li>data-vevet-filter-group - to what group the filter belongs</li>
     *      <li>data-vevet-filter-id - the filter's ID</li>
     * </ul>
     * 
     * @property {boolean} [saveOnChange=true] - Defines if you need to save values when filters are changed.
     * 
     * @property {string} [multipleSeparator=_]
     * @property {number} [timeout=0] - Timeout before loading.
     * 
     * @property {object} [popstate]
     * @property {boolean} [popstate.event=true] - Catch popstate event.
     * @property {boolean} [popstate.reload=false] - Reload on popstate.
     * @property {number} [popstate.timeout=300]
     * 
     * @property {Vevet.PaginationModule} pagination - Pagination Module.
     * 
     */
    /**
     * @alias Vevet.FilterModule
     * 
     * @param {Vevet.FilterModule.Properties} data
     */
    constructor(data) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}filter`;
    }

    /**
     * @readonly
     * @type {Vevet.FilterModule.Properties}
     */
    get defaultProp() {

        let prefix = this._prefix;
        
        return merge(super.defaultProp, {
            selectors: {
                group: `.${prefix}__group`,
                filter: `.${prefix}__filter`
            },
            saveOnChange: true,
            multipleSeparator: '_',
            timeout: 0,
            popstate: {
                event: true,
                reload: false,
                timeout: 300
            },
            pagination: {}
        });

    }

    /**
     * @member Vevet.FilterModule#prop
     * @memberof Vevet.FilterModule
     * @readonly
     * @type {Vevet.FilterModule.Properties}
     */

    /**
     * @member Vevet.FilterModule#_prop
     * @memberof Vevet.FilterModule
     * @protected
     * @type {Vevet.FilterModule.Properties}
     */

    /**
     * @memberof Vevet.FilterModule
     * @typedef {object} ChangeProperties
     * @augments Vevet.FilterModule.Properties
     * 
     * @property {Vevet.PaginationModule} [pagination]
     * 
     */

    /**
     * @function Vevet.FilterModule#changeProp
     * @memberof Vevet.FilterModule
     * @param {Vevet.FilterModule.ChangeProperties} [prop]
     */



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
            group: `data-${prefix}-group`,
            multiple: `data-${prefix}-multiple`,
            id: `data-${prefix}-id`
        };
        
        // elements
        this._groups = [];
        this._filters = [];
        this._filtersEvents = [];

        // current json - current filters
        this._json = '{}';

        // popstate
        this._popstateTimeout = false;

        // get elements
        this._elementsGet();
        this.setFilters(true);
        
        this._json = this._getFiltersQuery();

    }

    /**
     * @description Get filters.
     * @type {Array<Vevet.FilterModule.Filter>}
     * @readonly
     */
    get filters() {
        return this._filters;
    }

    /**
     * @description Get filter groups.
     * @type {Array<Vevet.FilterModule.Group>}
     * @readonly
     */
    get groups() {
        return this._groups;
    }



    /**
     * @description Get elements and form arrays of groups and filters.
     * @private
     */
    _elementsGet() {

        // get groups
        this._getGroups();
        // get filters
        this._getFilters();

    }

    /**
     * @description Get groups.
     * @private
     */
    _getGroups() {

        // clear groups
        this._groups = [];

        // get dom groups
        let items = selectEl.all(this._prop.selectors.group);
        items.forEach(el => {

            // get the group's id
            let group = this._getGroupId(el);
            if (group) {

                // check if it is multiple
                let multiple = this._getGroupMultiple(el);
                
                // create an object and push it to the stack
                this._groups.push({
                    el: el,
                    id: group,
                    multiple: multiple
                });

            }

        });

    }

    /**
     * @description Get filters.
     * @private
     */
    _getFilters() {

        // clear filters
        this._clearFilters();

        // get dom groups
        let items = selectEl.all(this._prop.selectors.filter),
            i = 0;
        items.forEach(el => {

            // get the filter's properties
            let group = this._getGroupByElement(el),
                id = this._getFilterID(el);
            if (group !== false & id !== false) {
                
                // create an object and push it to the stack
                let obj = {
                    el: el,
                    group: group,
                    active: el.classList.contains(`${this._prefix}__filter_active`),
                    disabled: false,
                    unique_id: generateId(i),
                    id: id
                };
                this._filters.push(obj);

                // set events
                let event = this.listener(el, "click", this.filterClick.bind(this, el));
                this._filtersEvents.push(event);

            }

            i++;

        });

    }

    /**
     * @description Remove events from filters.
     */
    _clearFilters() {

        this._filtersEvents.forEach(event => {
            this.removeEventListener(event);
        });
        
        this._filters = [];
        this._filtersEvents = [];
        
    }



    /**
     * @memberof Vevet.FilterModule
     * @typedef {object} Group
     * 
     * @property {HTMLElement} el
     * @property {string} id
     * @property {boolean} multiple
     * 
     */

    /**
     * @memberof Vevet.FilterModule
     * @typedef {object} Filter
     * 
     * @property {HTMLElement} el
     * @property {Vevet.FilterModule.Group} group
     * @property {boolean} active
     * @property {boolean} disabled
     * @property {string} id
     * @property {string} unique_id
     * 
     */



    /**
     * @description Get group id.
     * @param {HTMLElement} el
     * @returns {string|boolean} Returns the group's id or false.
     * @private
     */
    _getGroupId(el) {

        let attr = el.getAttribute(this._data.group);
        if (attr) {
            return attr;
        }

        return false;

    }

    /**
     * @description Check if the group is multiple.
     * @param {HTMLElement} el
     * @returns {boolean} Returns true or false.
     * @private
     */
    _getGroupMultiple(el) {

        let attr = el.getAttribute(this._data.multiple);
        if (attr) {
            return true;
        }

        return false;

    }

    /**
     * @description Get group of an element.
     * @param {HTMLElement} el
     * @returns {Vevet.FilterModule.Group|boolean} Returns the group or false.
     * @private
     */
    _getGroupByElement(el) {

        let attr = el.getAttribute(this._data.group);
        if (attr) {
            let group = false;
            this._groups.forEach(obj => {
                if (obj.id == attr) {
                    group = obj;
                }
            });
            return group;
        }

        return false;

    }

    /**
     * @description Get filter by element.
     * @param {HTMLElement} el
     * @returns {Vevet.FilterModule.Filter|boolean} Returns the group or false.
     * @private
     */
    _getFilterByElement(el) {

        let filter = false;
        this._filters.forEach(obj => {
            if (obj.el == el) {
                filter = obj;
            }
        });

        return filter;

    }

    /**
     * @description Get filter by the id of the group.
     * @param {string} id
     * @returns {Array<Vevet.FilterModule.Filter>} Returns filters.
     * @private
     */
    _getFiltersByGroupID(id) {

        let filters = [];
        this._filters.forEach(obj => {
            if (obj.group.id == id) {
                filters.push(obj);
            }
        });

        return filters;

    }

    /**
     * @description Get filters' id.
     * @param {HTMLElement} el
     * @returns {string|boolean} Returns the value or false.
     * @private
     */
    _getFilterID(el) {

        let attr = el.getAttribute(this._data.id);
        if (attr) {
            return attr;
        }

        return false;

    }



    /**
     * @description Save values and push them to the URL.
     * @returns {boolean} Returns true if there are any changes.
     */
    save() {

        let query = this._getFiltersQuery();
        if (query !== this._json) {
            let canUpdate = this._update(query);
            if (canUpdate) {
                this._json = query;
                this.lbt("save");
            }
            else {
                return false;
            }
        }

        return true;

    }



    /**
     * @description Click on filter. It can be also imitated.
     * @param {HTMLElement} el
     * @param {object} [e]
     * @returns {boolean} Returns true or false.
     */
    filterClick(el, e = false) {

        // prevent default action
        if (e) {
            e.preventDefault();
        }

        // get filter
        let filter = this._getFilterByElement(el);
        if (!filter) {
            return false;
        }

        // check if event possible
        if (!this._checkFilterClick(filter)) {
            return false;
        }
        
        // change values of the filters
        this._changeFiltersProp(filter);
        
        // change classes of the filters
        this._changeFiltersClasses(filter);

        // update values if saving is enabled
        if (this._prop.saveOnChange) {
            return this.save();
        }

        // return success
        return true;

    }

    /**
     * @description Check if the change of the filter is available.
     * @param {Vevet.FilterModule.Filter} filter
     * @private
     * @returns {boolean} Ture or false.
     */
    _checkFilterClick(filter) {

        let prop = this._prop;

        // check if pagination is loading
        if (prop.pagination.loading) {
            return false;
        }

        // if the filter is disabled
        if (filter.disabled) {
            return false;
        }

        return true;

    }

    /**
     * @description Change properties of the filters within one group - active values.
     * @param {Vevet.FilterModule.Filter} filter - Current filter.
     * @private
     */
    _changeFiltersProp(filter) {

        // get current group
        let group = filter.group;

        // get all filters
        let allFilters = this._getFiltersByGroupID(group.id);

        // change active/non-active of the current filter and other filters
        // within one group
        for (let i = 0; i < allFilters.length; i++) {

            let obj = allFilters[i];

            // make the current filter active/non-active if the group is multiple
            if (group.multiple) {
                if (obj.unique_id == filter.unique_id) {
                    obj.active = !filter.active;
                }
            }
            // make the current filter active and others non-active
            // if the group is not multiple
            else {
                if (obj.unique_id == filter.unique_id) {
                    obj.active = true;
                }
                else {
                    obj.active = false;
                }
            }
        }

    }

    /**
     * @description Set classes to the filters: active & disabled.
     * @private
     */
    _changeFiltersClasses() {

        let prefix = this._prefix;

        this._filters.forEach(filter => {

            // active class
            let activeClass = `${prefix}__filter_active`;
            if (filter.active) {
                filter.el.classList.add(activeClass);
            }
            else {
                filter.el.classList.remove(activeClass);
            }

            // disabled class & attribute (for selectors, buttons, etc)
            let disabledClass = `${prefix}__filter_disabled`;
            if (filter.disabled) {
                filter.el.classList.add(disabledClass);
                filter.el.disabled = true;
            }
            else {
                filter.el.classList.remove(disabledClass);
                filter.el.disabled = false;
            }

        });

    }



    /**
     * @description Set filter properties and classes according to the url. This happens
     * while initializing the class.
     * @param {boolean} considerClasses - Set true if you need to take into consideration active classes
     * of the filters. It is used on initialization.
     */
    setFilters(considerClasses = false) {

        const classActive = `${this._prefix}__filter_active`;

        // go thru all groups and search groups that exist in the URL
        this._groups.forEach(group => {

            let param = this._v.url.getParam({
                key: group.id
            });
            if(param) {

                let paramValues = param.split(this._prop.multipleSeparator);

                // get filters in the group
                let filters = this._getFiltersByGroupID(group.id);
                filters.forEach(filter => {
                    if (paramValues.includes(filter.id)) {
                        filter.active = true;
                    }
                    else {
                        filter.active = false;
                        if (considerClasses) {
                            if (filter.el.classList.contains(classActive)) {
                                filter.active = true;
                            }
                        }
                    }
                });

            }
            else {
                // get filters in the group
                let filters = this._getFiltersByGroupID(group.id);
                filters.forEach(filter => {
                    filter.active = false;
                    if (considerClasses) {
                        if (filter.el.classList.contains(classActive)) {
                            filter.active = true;
                        }
                    }
                });
            }

        });

        // set classes
        this._changeFiltersClasses();

    }


    
    /**
     * @description Get a url query according to the active filters.
     * @private
     */
    _getFiltersQuery() {

        let groupsFilters = {};
        this._filters.forEach(filter => {

            // check if the filter is active
            // and only then add it to its group
            if (filter.active) {

                // create group if doesn't exist
                let groupID = filter.group.id;
                if (typeof groupsFilters[groupID] == "undefined") {
                    groupsFilters[groupID] = [];
                }

                // add filter to the group
                groupsFilters[groupID].push(filter.id);

            }

        });

        // make a json of it
        let json = JSON.stringify(groupsFilters);

        return json;

    }

    /**
     * @description Get active url params.
     * @param {string} json
     * @returns {Array<Array<string>>} Returns values.
     * @private
     */
    _getURLParams(json) {

        let prop = this._prop;

        // create an array: key => value
        let obj = JSON.parse(json),
            params = [];
        for (let key in obj) {
            let values = obj[key].join(prop.multipleSeparator);
            params.push([key, values]);
        }

        return params;

    }

    /**
     * @description Update the URL & content according to active filters.
     * @param {string} json
     * @returns {boolean} Returns true the filters have changed.
     * @private
     */
    _update(json) {

        let prop = this._prop;

        // check if the url changed
        if (this._json == json) {
            return false;
        }

        // create an arryy: key => value
        let params = this._getURLParams(json),
            paramsPrev = this._getURLParams(this._json);

        // get pagination
        let pagination = prop.pagination;

        // reset pagination
        let url = this._v.url.setParam({
            key: pagination.prop.param,
            value: '',
            push: false
        });

        // reset previous params
        for (let i = 0; i < paramsPrev.length; i++) {
            let push = false;
            if (i == paramsPrev.length - 1) {
                push = params.length === 0 ? true : false;
            }
            url = this._v.url.setParam({
                url: url,
                key: paramsPrev[i][0],
                value: '',
                push: push
            });
        }

        // push it to the url
        for (let i = 0; i < params.length; i++) {
            let push = false;
            if (i == params.length - 1) {
                push = true;
            }
            url = this._v.url.setParam({
                url: url,
                key: params[i][0],
                value: params[i][1],
                push: push
            });
        }
        
        // update content
        pagination.url = url;
        pagination.reload(false);

        // success
        return true;

    }



    // Set events
    _setEvents() {

        // popstate event
        this.listener(window, "popstate", this._popstate.bind(this));

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
        
        this._popstateLoad();

    }

    /**
     * @description Catch popstate and load new data.
     * @private
     */
    _popstateLoad() {

        let prop = this._prop,
            timeout = prop.popstate.timeout,
            pagination = prop.pagination;

        // clear timeout
        if (this._popstateTimeout) {
            clearTimeout(this._popstateTimeout);
            this._popstateTimeout = false;
        }

        // check if available and then load
        if (!pagination.loading) {
            this._popstateTimeout = setTimeout(this._popstateForceLoad.bind(this), timeout);
        }
        // timeouts and callbacks if not available
        else {
            this._popstateTimeout = setTimeout(this._popstateBusyLoad.bind(this), timeout);
        }

    }

    /**
     * @description Popstate event when pagination is loading.
     * @private
     */
    _popstateBusyLoad() {

        this._prop.pagination.on("load", () => {
            this._popstateLoad();
        }, {
            once: true
        });

    }

    /**
     * @memberof Vevet.FilterModule
     * @typedef {object} PopstateCallback
     * 
     * @property {string} href
     * 
     */

    /**
     * @description Popstate force load.
     * @private
     */
    _popstateForceLoad() {

        this.lbt('popstate', {
            href: window.location.href
        });
        
        // set filters
        this.setFilters();

        // get pagination
        let pagination = this._prop.pagination;
        
        // update pagination url
        pagination.url = window.location.href;

        // update pagination active
        let active = this._v.url.getParam({
            key: pagination.prop.param
        });
        if (active != null) {
            active = parseInt(active);
        }
        else {
            active = 1;
        }
        pagination._active = active;

        // reload pagination
        pagination.reload(false, false);

    }



}