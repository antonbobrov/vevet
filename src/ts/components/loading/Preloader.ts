import { selectOne } from 'vevet-dom';
import PCancelable from 'p-cancelable';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';
import timeoutCallback from '../../utils/common/timeoutCallback';
import { NCallbacks } from '../../base/Callbacks';



export namespace NPreloader {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The preloader container. You may use a CSS selector, the element itself
         * or false if you need only the functionality.
         * @default '#v-preloader'
         */
        container?: string | HTMLElement | false;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
        /**
         * Automatically hide the preloader container.
         * False - not to hide the container, Number - for animation duration.
         * When hiding, such CSS properties as opacity & visibility are used.
         * @default 250
         */
        hide?: false | number;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'loaded': false;
        'hide': false;
        'hidden': false;
    }

}



/**
 * A page preloader
 */
export class Preloader <
    StaticProp extends NPreloader.StaticProp = NPreloader.StaticProp,
    ChangeableProp extends NPreloader.ChangeableProp = NPreloader.ChangeableProp,
    CallbacksTypes extends NPreloader.CallbacksTypes = NPreloader.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            container: `#${this.prefix}`,
            hide: 250,
        };
    }

    get prefix () {
        return `${this._app.prefix}preloader`;
    }



    /**
     * Preloader container
     */
    get container () {
        return this._container;
    }
    protected _container?: HTMLElement | false;

    /**
     * Preloader start time
     */
    get startTime () {
        return this._startTime;
    }
    protected _startTime: number;
    /**
     * Preloader end time
     */
    get endTime () {
        return this._endTime;
    }
    protected _endTime: number;
    /**
     * Total time of page loading before the preloader is to be hidden
     */
    get totalTime () {
        return this._endTime - this._startTime;
    }

    /**
     * If the preloader is to be hidden
     */
    protected _toBeHidden: boolean;

    /**
     * If the preloader is hidden
     */
    get isHidden () {
        return this._isHidden;
    }
    protected _isHidden: boolean;



    /**
     * Loading event
     */
    protected _pageLoadEvent?: NCallbacks.AddedCallback



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // get preloader container
        if (this.prop.container) {
            const container = selectOne(this.prop.container);
            if (container instanceof HTMLElement) {
                this._container = container;
            }
        }
        // add classes
        if (this._container) {
            this._container.classList.add(this.prefix);
        }

        // set default vars
        this._startTime = +new Date();
        this._endTime = Infinity;
        this._toBeHidden = false;
        this._isHidden = false;

        // initialize the class
        if (init) {
            this.init();
        }
    }

    protected _setEvents () {
        super._setEvents();
        this._onLoaded().then(() => {
            this._endTime = +new Date();
            this._handleLoaded();
        });
    }



    /**
     * Trace the moment when the page is fully loaded
     */
    protected _onLoaded () {
        return new PCancelable((
            resolve: (...arg: any) => void,
        ) => {
            if (this._app.pageLoad.loaded) {
                resolve();
            } else {
                this._pageLoadEvent = this._app.pageLoad.add('', () => {
                    resolve();
                });
            }
        });
    }



    /**
     * When the page is fully loaded
     */
    protected _handleLoaded () {
        this.callbacks.tbt('loaded', false);
        // hide the preloader
        if (typeof this.prop.hide !== 'boolean') {
            this.hideContainer();
        }
    }

    /**
     * Hide the container
     */
    public hideContainer (
        duration = typeof this.prop.hide !== 'boolean' ? this.prop.hide : 250,
    ) {
        this.callbacks.tbt('hide', false);
        this._toBeHidden = true;
        return new PCancelable((
            resolve: (...arg: any) => void,
        ) => {
            const container = this._container;
            // if container is not to be hidden
            if (!container) {
                this._handleHidden();
                resolve();
                return;
            }
            // if need to hide the container
            container.style.transition = `opacity ${duration}ms, visibility ${duration}ms`;
            container.style.opacity = '0';
            container.style.visibility = 'hidden';
            timeoutCallback(() => {
                container.style.display = 'none';
                this._handleHidden();
                resolve();
            }, duration);
        });
    }

    /**
     * Handle the moment when the container is hidden
     */
    protected _handleHidden () {
        this._isHidden = true;
        this.callbacks.tbt('hidden', false);
    }



    /**
     * Callback at the moment when the preloader starts hiding
     */
    public onHide (
        callback: () => void,
    ) {
        if (this._toBeHidden) {
            callback();
            return undefined;
        }
        return this.callbacks.add('hide', () => {
            callback();
        });
    }

    /**
     * Callback at the moment when the preloader is hidden
     */
    public onHidden (
        callback: () => void,
    ) {
        if (this._isHidden) {
            callback();
            return undefined;
        }
        return this.callbacks.add('hidden', () => {
            callback();
        });
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();

        this._pageLoadEvent?.remove();
    }
}
