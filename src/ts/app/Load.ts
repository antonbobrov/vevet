import { Callbacks } from '../base/Callbacks';



/**
 * Callbacks on page loaded.
 */
export class Load extends Callbacks<
    Load.CallbackType,
    Callbacks.Prop<Load.CallbackType>
> {

    /**
     * If the page is loaded.
     */
    protected _loaded: boolean;
    /**
     * If the page is loaded.
     */
    get loaded() {
        return this._loaded;
    }



    _constructor() {

        super._constructor();

        this._loaded = false;

    }
     
    protected _setEvents() {

        // add callbacks
        this.addCallback({
            func: this._onloaded.bind(this),
            protected: true
        });

        // launch callbacks on loaded
        window.addEventListener("load", this.triggerAllCallbacks.bind(this));

    }



    /**
     * When the page is loaded.
     */
    protected _onloaded() {

        const app = this._app;
        const prefix = app.prefix;
        this._loaded = true;

        app.html.classList.remove(`${prefix}loading`);
        app.body.classList.remove(`${prefix}loading`);

    }

}





export namespace Load {

    export type CallbackType = {
        target?: "",
        func: () => void
    } & Callbacks.CallbackBaseSettings;

}