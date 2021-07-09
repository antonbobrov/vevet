import { Callbacks, NCallbacks } from '../../base/Callbacks';



export namespace NPageLoad {

    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        '': false;
    }

}



/**
 * Callbacks on page loaded.
 */
export class PageLoad extends Callbacks<
    NPageLoad.CallbacksTypes
> {
    /**
     * If the page is loaded.
     */
    protected _loaded: boolean;

    /**
     * If the page is loaded.
     */
    get loaded () {
        return this._loaded;
    }



    constructor () {
        super(false);
        this._loaded = false;
        this._init();
    }

    // Extra constructor
    protected _constructor () {
        super._constructor();
        this._loaded = false;
    }

    protected _setEvents () {
        // add callbacks
        this.add('', this._handleLoaded.bind(this), {
            protected: true,
        });
        // launch callbacks on loaded
        window.addEventListener('load', () => {
            this.tbt('', false);
        });
    }



    /**
     * When the page is loaded.
     */
    protected _handleLoaded () {
        const app = this._app;
        const { prefix } = app;
        this._loaded = true;

        app.html.classList.remove(`${prefix}loading`);
        app.body.classList.remove(`${prefix}loading`);
        app.html.classList.add(`${prefix}loaded`);
    }



    /**
     * Add a callback on page load.
     * If the page is already loaded, the callback will be immediately triggered.
     */
    public onLoaded (
        callback: Function,
    ) {
        if (this.loaded) {
            callback();
        } else {
            this.add('', callback.bind(this));
        }
    }
}
