import { selectOne } from 'vevet-dom';
import { Component, NComponent } from '../../../base/Component';
import { RequiredModuleProp } from '../../../utils/types/utility';
import { SmoothScroll } from '../smooth-scroll/SmoothScroll';



export namespace NScrollEventsBase {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * The scrollable element
         * @default window
         */
        container?: string | Element | SmoothScroll | Window;
        /**
         * Intersection root element. If false, the element is found
         * automatically
         * @default false
         */
        intersectionRoot?: false | null | Element;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp { }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes { }

    /**
     * BoundingRect
     */
    export interface BoundingRect {
        top: number;
        left: number;
        width: number;
        height: number;
    }

}



/**
 * A base for scroll event components
 */
export abstract class ScrollEventsBase <
    StaticProp extends NScrollEventsBase.StaticProp = NScrollEventsBase.StaticProp,
    ChangeableProp extends NScrollEventsBase.ChangeableProp = NScrollEventsBase.ChangeableProp,
    CallbacksTypes extends NScrollEventsBase.CallbacksTypes = NScrollEventsBase.CallbacksTypes,
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
            intersectionRoot: false,
        };
    }



    /**
     * Scroll container
     */
    protected _scrollContainer: Element | SmoothScroll | Window;
    get scrollContainer () {
        return this._scrollContainer;
    }
    get scrollableElement () {
        if (this._scrollContainer instanceof Window) {
            return this._app.html;
        }
        return this._scrollContainer;
    }

    /**
     * Parent of inner elements
     */
    protected get domParent () {
        const { scrollContainer } = this;
        if (scrollContainer instanceof Window) {
            return this._app.body;
        }
        if (scrollContainer instanceof Element) {
            return scrollContainer;
        }
        return scrollContainer.outer;
    }

    /**
     * Used as a "root" for IntersectionObserver
     */
    protected get intersectionRoot () {
        if (this.prop.intersectionRoot === false) {
            const { scrollContainer } = this;
            if (scrollContainer instanceof Window) {
                return null;
            }
            if (scrollContainer instanceof Element) {
                return scrollContainer;
            }
            return scrollContainer.outer;
        }
        return this.prop.intersectionRoot;
    }

    /**
     * BoundingRect of 'scrollContainer'
     */
    protected get scrollContainerBounding (): NScrollEventsBase.BoundingRect {
        if (this.intersectionRoot) {
            const bounding = this.intersectionRoot.getBoundingClientRect();
            return {
                top: bounding.top,
                left: bounding.left,
                width: bounding.width,
                height: bounding.height,
            };
        }
        return {
            top: 0,
            left: 0,
            width: this._app.viewport.width,
            height: this._app.viewport.height,
        };
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

        // initialize the class
        if (init) {
            this.init();
        }
    }
}
