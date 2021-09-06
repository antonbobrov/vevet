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
    get loaded () {
        return this._loaded;
    }



    constructor () {
        super(false);
        this._loaded = false;
        this._init();
    }

    protected _setEvents () {
        if (document.readyState === 'complete') {
            this._handleLoaded();
        } else {
            window.addEventListener('load', () => {
                this._handleLoaded();
            });
        }
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

        this.tbt('', false);
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
            return undefined;
        }
        return this.add('', callback.bind(this));
    }
}
