import { Callbacks, NCallbacks } from '../base/Callbacks';



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



    protected _constructor () {
        super._constructor();
        this._loaded = false;
    }

    protected _setEvents () {

        // add callbacks
        this.add('', this._onLoaded.bind(this), {
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
    protected _onLoaded () {

        const app = this._app;
        const { prefix } = app;
        this._loaded = true;

        app.html.classList.remove(`${prefix}loading`);
        app.body.classList.remove(`${prefix}loading`);

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
        }
        else {
            this.add('', callback.bind(this));
        }

    }

}



export namespace NPageLoad {

    export interface CallbacksTypes extends NCallbacks.CallbacksTypes {
        '': false;
    }

}
