import Event from './Event';
import timeoutCallback from './timeoutCallback';

/**
 * @classdesc AJAX requests.
 * Available targets:
 *  <ul>
 *      <li>load - argument {@linkcode Vevet.AJAXEvent.LoadData}</li>
 *      <li>loaded - argument {@linkcode Vevet.AJAXEvent.CacheItem}</li>
 *  </ul>
 * <br><br> <b>import {AJAXEvent} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.AJAXEvent : load : Vevet.AJAXEvent.LoadData}
 * @vevetModuleCallback { Vevet.AJAXEvent : loaded : Vevet.AJAXEvent.CacheItem }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class AJAXEvent extends Event {


    _extra() {

        /**
         * @description Ajax Requests' Storage.
         * @member {Array<Vevet.AJAXEvent.CacheItem>}
         * @private
         */
        this._cache = [];

    }



    /**
     * @description Ajax Cache.
     * @readonly
     * @type {Array<Vevet.AJAXEvent.CacheItem>}
     */
    get cache() {
        return this._cache;
    }



    /**
     * @memberof Vevet.AJAXEvent
     * @typedef {object} LoadData
     * @property {string} [method=post] Method - post|get.
     * @property {string} [url=window.location.href] Request url.
     * @property {object} [data={}] Data to transmit through ajax.
     * @property {boolean} [cache=false] Save in cache.
     * @property {boolean} [async=true] Do the request asynchronously.
     * @property {Function} [success] Callback on success.
     * @property {Function} [abort] Callback when aborted.
     * @property {Function} [error] Callback on error.
     */
    /**
     * @description Load from url.
     * 
     * @param {Vevet.AJAXEvent.LoadData} data - Properties.
     * 
     * @example
     * 
     * ajax.load({
     *     url: window.location.href,
     *     data: {
     *         firstname: 'John',
     *         lastname: 'Doe',
     *     },
     *     method: 'post',
     *     cache: true,
     *     success: (data) => {
     *         console.log(data.xhr.responseText);
     *     },
     *     error: (data) => {
     *         console.log(data.xhr.responseText);
     *     },
     *     abort: () => {
     *         alert("abort");
     *     }
     * });
     * 
     */
    load(data) {

        let prop = {
            method: 'post',
            url: window.location.href,
            data: {},
            cache: false,
            async: true,
            success: () => {},
            abort: () => {},
            error: () => {}
        };
        prop = Object.assign(prop, data);

        // lowercase method
        prop.method = prop.method.toUpperCase();

        // check if exists in cache
        if (prop.cache) {
            let cache = this._cacheCheck({
                url: prop.url,
                method: prop.method,
                data: prop.data
            });
            if (cache) {
                prop.success(cache);
                return;
            }
        }

        // callback on load
        this.lbt('load', prop);

        // launch XHR request
        this._xhr(prop);

    }

    /**
     * @description XHR request.
     * @param {Vevet.AJAXEvent.LoadData} prop - Properties.
     * @private
     */
    _xhr(prop) {

        // data
        let hasCotent = false,
            url = prop.url,
            propData = prop.data,
            canAbort = true;

        if (prop.method == 'POST') {
            hasCotent = true;
            let arr = [];
            for (let key in propData) {
                arr.push(key + '=' + encodeURIComponent(propData[key]));
            }
            propData = arr.join("&");
        }
        else {
            for (let key in propData) {
                url = this._v.url.setParam({
                    key: key,
                    value: propData[key],
                    push: false,
                    url: url
                });
            }
        }

        // XHR
        let xhr = new XMLHttpRequest();
        xhr.open(prop.method, url, prop.async);

        // Set Headers
        if (prop.method == 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        // Callback Proceeded
        xhr.onreadystatechange = () => {

            if (xhr.readyState !== 4) {
                return;
            }

            let callbackObj = {
                url: prop.url,
                method: prop.method,
                data: prop.data,
                xhr: xhr
            };

            if (xhr.status === 200) {
                if (prop.cache) {
                    this._cacheSet(callbackObj);
                }
                prop.success(callbackObj);
            }
            else {
                prop.error(callbackObj);
            }

            // disable abortion
            canAbort = false;

            // callback on loaded
            this.lbt('loaded', callbackObj);

        };

        // Send Ajax
        xhr.send(hasCotent ? propData : null);

        // Timeout
        timeoutCallback(() => {
            if (canAbort) {
                xhr.onreadystatechange = null;
                xhr.abort();
                prop.abort();
            }
        }, this._vp.ajaxTimeMax);

    }



    /**
     * @description Check if the request exists in cache.
     * 
     * @private
     * 
     * @param {object} prop - Request properties, they are not the same as used in the "load" method.
     * @param {string} prop.url - Url of the request.
     * @param {string} prop.method - Method of the request.
     * @param {object} prop.data - Object of data to transmit through ajax.
     * 
     * @returns {boolean|object} Returns an object if the request exists in cache and false if it doesn't.
     */
    _cacheCheck(prop) {

        let cache = false;

        // go through all possible variants with the same url
        
        for (let i = 0; i < this._cache.length; i++) {

            // get obj
            let obj = this._cache[i];

            // compare url
            if (prop.url != obj.url) {
                continue;
            }

            // compare method
            if (prop.method != obj.method) {
                continue;
            }

            // compare data
            let length = Object.keys(prop.data).length,
                overlaps = 0;
            for (let dataKey in obj.data) {
                for (let propKey in prop.data) {
                    if (dataKey == propKey & obj.data[dataKey] == prop.data[propKey]) {
                        overlaps++;
                    }
                }
            }

            // set cache value
            if (overlaps == length) {
                cache = obj;
            }

        }
    
        return cache;

    }

    /**
     * @memberof Vevet.AJAXEvent
     * @typedef {object} CacheItem
     * @property {string} url
     * @property {string} method
     * @property {object} data
     * @property {XMLHttpRequest} xhr
     */
    /**
     * @description Set cache.
     * 
     * @private
     * 
     * @param {Vevet.AJAXEvent.CacheItem} prop - Object with the request data.
     */
    _cacheSet(prop) {
        this._cache.push(prop);
    }

    /**
     * @description Clear cache.
     */
    cacheClear() {

        this._cache = [];

    }

    



}