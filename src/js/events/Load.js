import Event from './Event';

/**
 * @classdesc Callbacks on page loaded.
 * <br><br> <b>import {Load} from 'vevet';</b>
 * @class
 * @memberof Vevet
 * @augments Vevet.Event
 */
export default class Load extends Event {


    _extra() {

        super._extra();

        /**
         * @description If the page is loaded.
         * @type {boolean}
         * @private
         */
        this._loaded = false;

    }



    /**
     * @description If page is loaded.
     * @default false
     * @readonly
     * @type {boolean}
     */
    get loaded() {
        return this._loaded;
    }


     
    _setEvents() {

        // add callbacks
        this.add({
            do: () => {
                let prefix = this._vp.prefix;
                this._loaded = true;
                this._v.html.classList.remove(`${prefix}loading`);
                this._v.body.classList.remove(`${prefix}loading`);
            },
            protected: true
        });

        // launch callbacks on loaded
        window.addEventListener("load", this.launchAll.bind(this));

    }



}