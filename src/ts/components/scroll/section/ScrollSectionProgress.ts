import { selectOne } from 'vevet-dom';
import PCancelable from 'p-cancelable';
import { IRemovable } from '../../../utils/types/general';
import { RequiredModuleProp } from '../../../utils/types/utility';
import onScroll from '../../../utils/listeners/onScroll';
import { Component, NComponent } from '../../../base/Component';
import { NViewport } from '../../../app/events/Viewport';
import { SmoothScroll } from '../smooth-scroll/SmoothScroll';
import clampScope from '../../../utils/math/clampScope';
import getScrollValues from '../../../utils/scroll/getScrollValues';



export namespace NScrollSectionProgress {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The scrollable container
         * @default window
         */
        container?: string | Element | SmoothScroll | Window;
        /**
         * The scrollable element
         */
        section: string | Element;
        /**
         * Viewport target on resize
         * @default ''
         */
        viewportTarget?: keyof NViewport.CallbacksTypes;
        /**
         * @default 0
         */
        resizeTimeout?: number;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'render': false;
        'resize': false;
    }

}



/**
 * Elements into viewport
 */
export class ScrollSectionProgress <
    StaticProp extends NScrollSectionProgress.StaticProp
        = NScrollSectionProgress.StaticProp,
    ChangeableProp extends NScrollSectionProgress.ChangeableProp
        = NScrollSectionProgress.ChangeableProp,
    CallbacksTypes extends NScrollSectionProgress.CallbacksTypes
        = NScrollSectionProgress.CallbacksTypes,
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
            container: window,
            viewportTarget: '',
            resizeTimeout: 0,
        };
    }

    /**
     * Scroll container
     */
    protected _scrollContainer: Element | SmoothScroll | Window;
    get scrollContainer () {
        return this._scrollContainer;
    }

    /**
     * Section element
     */
    protected _section: Element;
    get section () {
        return this._section;
    }

    /**
     * Scroll event
     */
    protected _scrollEvent?: IRemovable;
    /**
     * Loaded event
     */
    protected _loadedEvent?: PCancelable<any>;

    /**
     * Scrolling scope
     */
    protected _scopeScroll: [number, number];
    get scopeScroll () {
        return this._scopeScroll;
    }

    /**
     * 'In' scope relative to the global progress
     */
    protected _scopeIn: [number, number];
    protected get scopeIn () {
        return this._scopeIn;
    }

    /**
     * 'Move' scope relative to the global progress
     */
    protected _scopeMove: [number, number];
    get scopeMove () {
        return this._scopeMove;
    }

    /**
     * 'Move' scope relative to the global progress
     */
    protected _scopeOut: [number, number];
    get scopeOut () {
        return this._scopeOut;
    }

    protected _progress: number;
    /**
     * Global progress
     */
    get progress () {
        return this._progress;
    }
    set progress (val) {
        this._progress = val;
    }



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // get scroll container
        if (typeof this.prop.container === 'string') {
            this._scrollContainer = selectOne(this.prop.container) as Element;
        } else {
            this._scrollContainer = this.prop.container;
        }

        // get section element
        if (typeof this.prop.section === 'string') {
            this._section = selectOne(this.prop.section) as Element;
        } else {
            this._section = this.prop.section;
        }

        // set defaults
        this._progress = -0.001;
        this._scopeScroll = [0, 0];
        this._scopeIn = [0, 0];
        this._scopeMove = [0, 0];
        this._scopeOut = [0, 0];

        // initialize the class
        if (init) {
            this.init();
        }
    }

    public init () {
        super.init();
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();

        // set resize events
        this.addViewportCallback(this.prop.viewportTarget, () => {
            this.resize();
        }, {
            timeout: this.prop.resizeTimeout,
        });

        // resize on page loaded
        this._loadedEvent = this._app.onPageLoaded();
        this._loadedEvent.then(() => {
            this.resize();
        }).catch(() => {});

        // set scroll events
        this._scrollEvent = onScroll({
            container: this.prop.container,
            callback: this._handleScroll.bind(this),
        });
    }

    protected _onPropMutate () {
        super._onPropMutate();
        this.resize();
    }



    /**
     * 'in' progress
     */
    get progressIn () {
        return clampScope(
            this.progress,
            this.scopeIn,
        ) || 0;
    }

    /**
     * 'out' progress
     */
    get progressOut () {
        return clampScope(
            this.progress,
            this.scopeOut,
        ) || 0;
    }

    /**
     * 'move' progress
     */
    get progressMove () {
        return clampScope(
            this.progress,
            this.scopeMove,
        ) || 0;
    }



    /**
     * Handle scroll event
     */
    protected _handleScroll () {
        // calculate scopes
        const scrollData = getScrollValues(this.scrollContainer);
        if (!scrollData) {
            return;
        }
        this._render(scrollData);
    }



    /**
     * Resize the scene
     */
    public resize () {
        // calculate scopes
        const scrollData = getScrollValues(this.scrollContainer);
        if (!scrollData) {
            return;
        }

        // get sizes
        const bounding = this.section.getBoundingClientRect();
        const vHeight = this._app.viewport.height;

        // calculate scroll scope
        const inStart = scrollData.scrollTop + bounding.top - vHeight;
        const moveEnd = scrollData.scrollTop + bounding.top + bounding.height;
        const scrollLine = moveEnd - inStart;
        this._scopeScroll = [inStart, moveEnd];

        // calculate scopes
        this._scopeIn = [0, vHeight / scrollLine];
        this._scopeOut = [1 - vHeight / scrollLine, 1];
        this._scopeMove = [this._scopeIn[1], this._scopeOut[0]];

        // launch callbacks
        this.callbacks.tbt('resize', false);

        // render the scene
        this._render(scrollData, true);
    }

    /**
     * Render the scene
     */
    protected _render (
        scrollData: ReturnType<typeof getScrollValues>,
        force = false,
    ) {
        const canRender = this._canRender(scrollData, force);
        if (!canRender) {
            return;
        }
        this.callbacks.tbt('render', false);
    }

    /**
     * Check if the section can be rendered
     */
    protected _canRender (
        scrollData: ReturnType<typeof getScrollValues>,
        force = false,
    ) {
        if (!scrollData) {
            return false;
        }
        const { scrollTop } = scrollData;
        const prevProgress = this.progress;

        const progress = clampScope(
            scrollTop,
            [this._scopeScroll[0], this._scopeScroll[1]],
        ) || 0;
        this.progress = progress;

        return force || (progress !== prevProgress);
    }


    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._scrollEvent?.remove();
        this._loadedEvent?.cancel();
    }
}
