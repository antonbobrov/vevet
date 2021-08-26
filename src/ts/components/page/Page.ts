import { Component, NComponent } from '../../base/Component';
import { mergeWithoutArrays } from '../../utils/common';
import { DeepRequired } from '../../utils/types/utility';



export namespace NPage {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The name of the page
         * @default 'home'
         */
        name?: string;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'create': false;
        'show': false;
        'hide': false;
        'destroy': false;
    }

}



/**
 * Page is a class that may be used to initialize a page.
 * The reason to use this class is that it allows to set a definite name for the page and manipulate
 * with its states: creation, show, hide, and destruction.
 * Notice that the states must be called a definite order: create -> show -> hide -> destroy
 * and vice versa.
 */
export class Page <
    StaticProp extends NPage.StaticProp = NPage.StaticProp,
    ChangeableProp extends NPage.ChangeableProp = NPage.ChangeableProp,
    CallbacksTypes extends NPage.CallbacksTypes = NPage.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    /**
     * If the page is created
     */
    protected _created: boolean;
    get created () {
        return this._created;
    }

    /**
     * If the page is shown
     */
    protected _shown: boolean;
    get shown () {
        return this._shown;
    }

    /**
     * If the page is hidden
     */
    protected _hidden: boolean;
    get hidden () {
        return this._hidden;
    }

    /**
     * If the page was loaded through AJAX
     */
    protected _viaAJAX: boolean;
    get viaAJAX () {
        return this._viaAJAX;
    }

    constructor (
        initialProp: (StaticProp & ChangeableProp) = {} as (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // set default vars
        this._created = false;
        this._shown = false;
        this._hidden = false;
        this._destroyed = false;
        this._viaAJAX = false;

        // initialize the class
        if (init) {
            this.init();
        }
    }

    protected _getDefaultProp () {
        const prop: DeepRequired<
            Omit<
                NPage.StaticProp & NPage.ChangeableProp,
                keyof (NComponent.StaticProp & NComponent.ChangeableProp)
            >
        > = {
            name: 'home',
        };
        return mergeWithoutArrays(super._getDefaultProp(), prop);
    }



    /**
     * Create the page.
     * @param viaAJAX - If the page was loaded through AJAX
     */
    public create (
        viaAJAX = false,
    ) {
        // check if action is available
        if (!this.canCreate()) {
            return false;
        }

        // update vars
        this._created = true;
        this._shown = false;
        this._hidden = false;
        this._destroyed = false;
        this._viaAJAX = viaAJAX;

        // update page
        this._app.page = this as unknown as Page;

        // launch events
        this.callbacks.tbt('create', false);

        // launch inner method
        this._innerCreate();

        return this;
    }

    /**
     * Inner method on page created
     */
    protected _innerCreate () { }

    /**
     * Check if the page can be created.
     */
    public canCreate () {
        return !this._created;
    }



    /**
     * Show the page.
     */
    public show () {
        // check if action is available
        if (!this.canShow()) {
            return false;
        }

        // update vars
        this._created = true;
        this._shown = true;
        this._hidden = false;
        this._destroyed = false;

        // launch events
        this.callbacks.tbt('show', false);

        // launch inner method
        this._innerShow();

        return true;
    }

    /**
     * Inner method on page shown
     */
    protected _innerShow () { }

    /**
     * Check if the page can be shown.
     */
    public canShow () {
        return this._created && !this._shown;
    }



    /**
     * Hide the page.
     */
    public hide () {
        // check if action is available
        if (!this.canHide()) {
            return false;
        }

        // update vars
        this._created = true;
        this._shown = false;
        this._hidden = true;
        this._destroyed = false;

        // launch events
        this.callbacks.tbt('hide', false);

        // launch inner method
        this._innerHide();

        return true;
    }

    /**
     * Inner method on page hidden
     */
    protected _innerHide () { }

    /**
     * Check if the page can be hidden.
     */
    public canHide () {
        return this._created && this._shown && !this._hidden;
    }



    /**
     * Destroy the page.
     */
    public destroy () {
        // check if action is available
        if (!this.canDestroy()) {
            return false;
        }
        super.destroy();

        // change vars
        this._created = false;
        this._shown = false;
        this._hidden = true;
        this._destroyed = true;

        // update page
        this._app.page = false;

        // launch inner method
        this._innerDestroy();

        return true;
    }

    /**
     * Inner method on page destroyed
     */
    protected _innerDestroy () { }

    /**
     * Check if the page can be destroyed.
     */
    public canDestroy () {
        return this._created && this._hidden;
    }



    /**
     * Add a 'create' callback.
     * If the callback was added after the page was created, it will be triggered immediately.
     */
    onCreate () {
        return new Promise((
            resolve: (...arg: any) => void,
        ) => {
            if (this._created) {
                resolve();
            } else {
                this.addCallback('create', () => {
                    resolve();
                });
            }
        });
    }

    /**
     * Add a 'show' callback.
     * If the callback was added after the page was shown, it will be triggered immediately.
     */
    onShow () {
        return new Promise((
            resolve: (...arg: any) => void,
        ) => {
            if (this._shown) {
                resolve();
            } else {
                this.addCallback('show', () => {
                    resolve();
                });
            }
        });
    }

    /**
     * Add a 'hide' callback.
     * If the callback was added after the page was hidden, it will be triggered immediately.
     */
    onHide () {
        return new Promise((
            resolve: (...arg: any) => void,
        ) => {
            if (this._hidden) {
                resolve();
            } else {
                this.addCallback('hide', () => {
                    resolve();
                });
            }
        });
    }
}
