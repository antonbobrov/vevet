import { Callbacks, ICallbacks } from '../base/Callbacks';



/**
 * @namespace
 */
export namespace ILoad {

    export type CallbackType = {
        do: () => void;
    } & ICallbacks.CallbackBaseSettings;

}



/**
 * Callbacks on page loaded.
 */
export class Load extends Callbacks<
    ILoad.CallbackType
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
        this.add({
            do: this._onloaded.bind(this),
            protected: true,
        });

        // launch callbacks on loaded
        window.addEventListener('load', this.triggerAll.bind(this));

    }



    /**
     * When the page is loaded.
     */
    protected _onloaded () {

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
            this.add({
                do: callback.bind(this),
            });
        }

    }

}
