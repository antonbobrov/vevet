import { childOf } from 'vevet-dom';
import { Plugin, NPlugin } from '../../../base/Plugin';
import timeoutCallback from '../../../utils/common/timeoutCallback';
import { SmoothScroll as SmoothScrollInstance } from '../smooth-scroll/SmoothScroll';



export namespace NSmoothScrollKeyboardPlugin {

    /**
     * Static properties
     */
    export interface StaticProp extends NPlugin.StaticProp {}

    /**
     * Changeable Properties
     */
    export interface ChangeableProp extends NPlugin.ChangeableProp {}

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NPlugin.CallbacksTypes {}

}



/**
 * A class for Plugins.
 */
export class SmoothScrollKeyboardPlugin<
    StaticProp extends NSmoothScrollKeyboardPlugin.StaticProp
        = NSmoothScrollKeyboardPlugin.StaticProp,
    ChangeableProp extends NSmoothScrollKeyboardPlugin.ChangeableProp
        = NSmoothScrollKeyboardPlugin.ChangeableProp,
    CallbacksTypes extends NSmoothScrollKeyboardPlugin.CallbacksTypes
        = NSmoothScrollKeyboardPlugin.CallbacksTypes
> extends Plugin <
    StaticProp,
    ChangeableProp,
    CallbacksTypes,
    SmoothScrollInstance
> {
    protected _setEvents () {
        super._setEvents();
        this.addEventListeners(window, 'keydown', (e) => {
            this._handleKeydown(e);
        });
    }



    /**
     * Event on a key pressed
     */
    protected _handleKeydown (e: KeyboardEvent) {
        const component = this._component;
        if (!component.prop.enabled) {
            return;
        }

        // tab is active for everethyng, forms too
        if (e.keyCode === 9) {
            this._handleTab();
            return;
        }

        // check if some element is under focus
        // if some exists, ignore key events
        const { activeElement } = document;
        if (activeElement) {
            if (
                activeElement instanceof HTMLInputElement
                || activeElement instanceof HTMLTextAreaElement
            ) {
                return;
            }
        }

        // update scroll values
        const scrollIterator = 40;
        switch (e.keyCode) {
            // up
            case 38:
                component.targetTop -= scrollIterator;
                break;
            // down
            case 40:
                component.targetTop += scrollIterator;
                break;

            // right
            case 39:
                component.targetLeft += scrollIterator;
                break;
            // left
            case 37:
                component.targetLeft -= scrollIterator;
                break;

            // page down
            case 34:
                component.targetTop += scrollIterator * 10;
                break;
            // page up
            case 33:
                component.targetTop -= scrollIterator * 10;
                break;

            // home
            case 36:
                component.targetTop = 0;
                component.targetLeft = 0;
                break;
            // end
            case 35:
                component.targetTop = component.scrollHeight;
                component.targetLeft = component.scrollWidth;
                break;

            // space
            case 32:
                component.targetTop += scrollIterator * 5;
                break;

            default:
                break;
        }
    }

    /**
     * Handle Tab key pressed
     */
    protected _handleTab () {
        // get active element and scroll to it
        timeoutCallback(() => {
            const scroll = this._component;
            const { activeElement } = document;

            // skip elements that do not belong to the SmoothScroll outer
            if (
                !(activeElement instanceof HTMLElement)
                || !childOf(activeElement, scroll.outer)
            ) {
                return;
            }

            // get boundings
            const scrollOuterBounding = scroll.outer.getBoundingClientRect();
            const activeElementBounding = activeElement.getBoundingClientRect();

            // get element position
            const top = scroll.scrollTop
            + (activeElementBounding.top - scrollOuterBounding.top)
            - (scroll.clientHeight / 2 - activeElementBounding.height / 2);
            const left = scroll.scrollLeft
                + (activeElementBounding.left - scrollOuterBounding.left)
                - (scroll.clientWidth / 2 - activeElementBounding.width / 2);

            // apply new targets
            scroll.targetTop = top;
            scroll.targetLeft = left;
        }, 120);
    }
}
