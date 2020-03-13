import Event from './Event';

/**
 * @classdesc URL manipulation.
 * Available targets:
 *  <ul>
 *      <li>getParam - agrument {@linkcode Vevet.URLEvent.GetParam}</li>
 *      <li>setParam - argument {@linkcode Vevet.URLEvent.SetParam}</li>
 *  </ul>
 * <br><br> <b>import {URLEvent} from 'vevet';</b>
 * 
 * @vevetModuleCallback { Vevet.URLEvent : getParam : Vevet.URLEvent.GetParam }
 * @vevetModuleCallback { Vevet.URLEvent : setParam : Vevet.URLEvent.SetParam }
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class URLEvent extends Event {



    /**
     * @memberof Vevet.URLEvent
     * @typedef {object} GetParam
     * @property {string} key The name of your parameter.
     * @property {string} url The url where the parameter was checked.
     * @property {string} value The value of the parameter.
     */
    /**
     * @description Get a parameter from url.
     * 
     * @param {object} data - Object with information.
     * @param {string} data.key - Name of the parameter.
     * @param {string} [data.url] - Url from which the value will be taken. The default value is the current url.
     * 
     * @returns {string|null} Returns the value of the parameter.
     */
    getParam(data) {

        // get data
        let prop = {
            url: window.location.href
        };
        data = Object.assign(prop, data);

        let {key, url} = data;

        // check if url has a protocol
        // if no, add an origin
        const testURL = /^https?:\/\//i;
        if (!testURL.test(url)) {
            if (url.indexOf('/') === 0) {
                url = window.location.origin + url;
            }
            else {
                url = window.location.origin + '/' + url;
            }
        }

        // search for the param
        key = key.replace(/[[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }

        // get value
        let val = decodeURIComponent(results[2].replace(/\+/g, " "));

        // launch events
        this.lbt('getParam', {
            key: key,
            url: url,
            value: val
        });

        // return the value
        return val;

    }



    /**
     * @memberof Vevet.URLEvent
     * @typedef {object} SetParam
     * @property {string} key The name of param.
     * @property {string} value The value of the param.
     * @property {boolean} push True if the new value was pushed to the page url.
     * @property {string} url The url before the change.
     * @property {string} newUrl The url after the change.
     */
    /**
     * @description Set a parameter in url.
     * 
     * @param {object} data - Object with information.
     * @param {string} data.key - The name of the parameter.
     * @param {string} data.value - The new value of the parameter.
     * @param {string} [data.push=true] - Identifies if we need to push the new parameter into the page url.
     * @param {string} [data.url=window.location.href] - Url in which the value will be set.
     * 
     * @returns {string} Returns new url.
     */
    setParam(data) {

        // get data
        let prop = {
            push: true,
            url: window.location.href
        };
        data = Object.assign(prop, data);

        let {key, value, push, url} = data;

        // set the new value
        key = encodeURI(key);
        value = encodeURI(value);
    
        let urlObj = null;
        if (url.length > 0) {
            urlObj = new URL(url);
        }
        else {
            urlObj = window.location;
        }
    
        let kvp = urlObj.search.substr(1) === "" ? [] : urlObj.search.substr(1).split('&'),
            i=kvp.length,
            x;
    
        while (i--) {
            x = kvp[i].split('=');
            if (x[0] == key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }
    
        if (i<0) {
            kvp[kvp.length] = [key, value].join('=');
        }
    
        let string = urlObj.pathname + '?' + kvp.join('&');
        if (value.length === 0) {
            string = string.replace("?" + key + "=&", "?");
            string = string.replace("?" + key + "=", "");
            string = string.replace("&" + key + "=", "");
            string = string.replace(key + "=", "");
        }

        // push state
        if (push) {
            window.history.pushState(null, "", string);
        }

        // new value
        let val = urlObj.origin + string;

        // launch events
        this.lbt('setParam', {
            key: key,
            value: value,
            push: push,
            url: url,
            newUrl: val
        });

        // return a new url
        return val;

    }



}