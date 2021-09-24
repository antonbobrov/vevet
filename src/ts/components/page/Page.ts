import CancelablePromise from 'cancelable-promise';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';



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

    get pageClassName () {
        return `${this._app.prefix}page-${this.prop.name}`;
    }

    constructor (
        initialProp?: (StaticProp & ChangeableProp),
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

    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            name: 'home',
        };
    }



    /**
     * Create the page.
     * @param viaAJAX - If the page was loaded through AJAX
     */
    public create (
        viaAJAX = false,
    ) {
        return new Promise<void>((
            resolve, reject,
        ) => {
            this.canCreate().then(() => {
                if (this.created) {
                    return;
                }
                // update vars
                this._created = true;
                this._shown = false;
                this._hidden = false;
                this._destroyed = false;
                this._viaAJAX = viaAJAX;

                // update page
                this._app.page = this as unknown as Page;
                // add page class
                this._app.html.classList.add(this.pageClassName);

                // actions
                this._create().then(() => {
                    this.callbacks.tbt('create', false);
                    resolve();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Use this method to do some actions when creating a page
     */
    protected _create () {
        return new Promise<void>((
            resolve,
        ) => {
            resolve();
        });
    }

    /**
     * Check if the page can be created.
     */
    public canCreate () {
        return new Promise<void>((
            resolve, reject,
        ) => {
            if (!this.created) {
                resolve();
                return;
            }
            reject();
        });
    }



    /**
     * Show the page.
     */
    public show () {
        return new Promise<void>((
            resolve, reject,
        ) => {
            this.canShow().then(() => {
                if (this.shown) {
                    return;
                }
                // update vars
                this._created = true;
                this._shown = true;
                this._hidden = false;
                this._destroyed = false;

                // actions
                this._show().then(() => {
                    this.callbacks.tbt('show', false);
                    resolve();
                });
                // launch events
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Use this method to do some actions when showing a page
     */
    protected _show () {
        return new Promise<void>((
            resolve,
        ) => {
            resolve();
        });
    }

    /**
     * Check if the page can be shown.
     */
    public canShow () {
        return new Promise<void>((
            resolve, reject,
        ) => {
            if (this.created && !this.shown) {
                resolve();
                return;
            }
            reject();
        });
    }



    /**
     * Hide the page.
     */
    public hide () {
        return new Promise((
            resolve: (...arg: any) => void,
            reject: (...arg: any) => void,
        ) => {
            this.canHide().then(() => {
                if (this.hidden) {
                    return;
                }
                // update vars
                this._created = true;
                this._shown = false;
                this._hidden = true;
                this._destroyed = false;

                // actions
                this._hide().then(() => {
                    this.callbacks.tbt('hide', false);
                    resolve();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Use this method to do some actions when hiding a page
     */
    protected _hide () {
        return new Promise<void>((
            resolve,
        ) => {
            resolve();
        });
    }

    /**
     * Check if the page can be hidden.
     */
    public canHide () {
        return new Promise<void>((
            resolve, reject,
        ) => {
            if (this.created && this.shown && !this.hidden) {
                resolve();
                return;
            }
            reject();
        });
    }



    /**
     * Destroy the page.
     */
    public destroy () {
        return new Promise((
            resolve: (...arg: any) => void,
            reject: (...arg: any) => void,
        ) => {
            this.canDestroy().then(() => {
                if (this.destroyed) {
                    return;
                }
                // change vars
                this._created = false;
                this._shown = false;
                this._hidden = true;
                this._destroyed = true;

                // update page
                this._app.page = false;
                // remove page class
                this._app.html.classList.remove(this.pageClassName);

                // actions
                this._destroy().then(() => {
                    resolve();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Use this method to do some actions when destroying a page
     */
    protected _destroy () {
        return new Promise<void>((
            resolve,
        ) => {
            super._destroy();
            resolve();
        });
    }

    /**
     * Check if the page can be destroyed.
     */
    public canDestroy () {
        return new Promise<void>((
            resolve, reject,
        ) => {
            if (this.created && this.hidden && !this.destroyed) {
                resolve();
                return;
            }
            reject();
        });
    }



    /**
     * Add a 'create' callback.
     * If the callback was added after the page was created, it will be triggered immediately.
     */
    onCreate () {
        return new CancelablePromise<void>((
            resolve,
        ) => {
            if (this.created) {
                resolve();
            } else {
                this.addCallback('create', () => {
                    resolve();
                }, {
                    once: true,
                });
            }
        });
    }

    /**
     * Add a 'show' callback.
     * If the callback was added after the page was shown, it will be triggered immediately.
     */
    onShow () {
        return new CancelablePromise<void>((
            resolve,
        ) => {
            if (this.shown) {
                resolve();
            } else {
                this.addCallback('show', () => {
                    resolve();
                }, {
                    once: true,
                });
            }
        });
    }

    /**
     * Add a 'hide' callback.
     * If the callback was added after the page was hidden, it will be triggered immediately.
     */
    onHide () {
        return new CancelablePromise<void>((
            resolve,
        ) => {
            if (this.hidden) {
                resolve();
            } else {
                this.addCallback('hide', () => {
                    resolve();
                }, {
                    once: true,
                });
            }
        });
    }
}
