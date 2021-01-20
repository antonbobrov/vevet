import { Component, NComponent } from '../../base/Component';
import { mergeWithoutArrays } from '../../utils/common';



/**
 * This is a class for creating a page instance. <br>
 * The goal of the class is to split code into four states:
 * **create, show, hide and destroy**. <br>
 * While initialization, the page instance will be added to {@linkcode Application._pages},
 * which will be useful when using {@linkcode PageAjaxLoader}. <br>
 * Besides, the order of the states is very important:
 * * the page cannot be shown if it is not created,
 * * it cannot be hidden if it is not shown,
 * * it cannot be destroyed if it is not hidden.
 *
 * The order of states must be like: **create -> show <-> hide -> destroy**.
 */
export class Page<
    StaticProp extends NPage.StaticProp = NPage.StaticProp,
    ChangeableProp extends NPage.ChangeableProp = NPage.ChangeableProp,
    CallbacksTypes extends NPage.CallbacksTypes = NPage.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {



    get defaultProp () {
        const prop: Required<
            Omit<
                NPage.StaticProp & NPage.ChangeableProp,
                keyof (NComponent.StaticProp & NComponent.ChangeableProp)
            >
        > = {
            name: 'home-page',
        };
        return mergeWithoutArrays(super.defaultProp, prop);
    }



    // States of the page

    protected _created = false;
    get created () {
        return this._created;
    }

    protected _shown = false;
    get shown () {
        return this._shown;
    }

    protected _hidden = false;
    get hidden () {
        return this._hidden;
    }

    protected _destroyed = false;
    get destroyed () {
        return this._destroyed;
    }



    // Extra constructor
    protected _constructor () {

        super._constructor();

        // add the page to the application
        const instance = this as unknown;
        this._app.pages.push(instance as Page);

    }



    /**
     * Create the page
     */
    public create () {

        if (!this.canCreate()) {
            return false;
        }

        // change states
        this._created = true;
        this._shown = false;
        this._hidden = false;
        this._destroyed = false;

        // update page
        const instance = this as unknown;
        this._app.page = instance as Page;

        // launch event
        this.callbacks.tbt('create', false);

        return true;

    }

    /**
     * Check if the page can be created.
     */
    public canCreate () {
        return !this._created;
    }



    /**
     * Show the page
     */
    public show () {

        if (!this.canShow()) {
            return false;
        }

        // change states
        this._created = true;
        this._shown = true;
        this._hidden = false;
        this._destroyed = false;

        // launch event
        this.callbacks.tbt('show', false);

        return true;

    }

    /**
     * Check if the page can be shown.
     */
    public canShow () {
        return (this._created && !this._shown);
    }



    /**
     * Hide the page
     */
    public hide () {

        if (!this.canHide()) {
            return false;
        }

        // change states
        this._created = true;
        this._shown = false;
        this._hidden = true;
        this._destroyed = false;

        // launch event
        this.callbacks.tbt('hide', false);

        return true;

    }

    /**
     * Check if the page can be hidden.
     */
    public canHide () {
        return (this._created && this._shown && !this._hidden);
    }



    /**
     * Destroy the page
     */
    public destroy () {

        if (!this.canDestroy()) {
            return false;
        }

        // change states
        this._created = false;
        this._shown = false;
        this._hidden = true;
        this._destroyed = true;

        // remove the page
        this._app.page = false;

        // destroy the whole module
        super.destroy();

        return true;

    }

    /**
     * Check if the page can be destroyed.
     */
    public canDestroy () {
        return (this._created && this._hidden);
    }



}



/**
 * @namespace
 */
export namespace NPage {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The name of the page
         * @default 'home-page'
         */
        name?: string;
    }

    /**
     * Changeable Properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {}

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
