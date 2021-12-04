import { addEventListener, createElement, IAddEventListener } from 'vevet-dom';
import { IRemovable } from '../../../utils/types/general';
import onScroll from '../../../utils/listeners/onScroll';
import boundVal from '../../../utils/math/boundVal';
import { DraggerMove, NDraggerMove } from '../../dragger/DraggerMove';
import { SmoothScroll } from '../smooth-scroll/SmoothScroll';

interface Data {
    container: Window | SmoothScroll | Element;
    domParent: Element;
    dir: 'x' | 'y';
    autoHide: boolean;
    autoSize: boolean;
    minSize: number;
    optimizeCalculations: boolean;
    prefix: string;
    isDraggable: boolean;
    draggableScrollBehavior: 'smooth' | 'auto';
}

export default class Bar {
    // elements
    protected _outer: HTMLElement;
    get outer () {
        return this._outer;
    }
    protected _thumb: HTMLElement;
    get thumb () {
        return this._thumb;
    }

    // global
    get prefix () {
        return this._prop.prefix;
    }
    get isX () {
        return this.prop.dir === 'x';
    }
    get isY () {
        return !this.isX;
    }

    // sizes
    protected _outerHeight: number;
    protected _outerWidth: number;
    protected _thumbHeight: number;
    protected _thumbWidth: number;

    get scrollElement () {
        return this.prop.container instanceof Window
            ? document.documentElement : this.prop.container;
    }

    get scrollLine () {
        const { scrollElement } = this;
        return this.isX
            ? scrollElement.scrollWidth - scrollElement.clientWidth
            : scrollElement.scrollHeight - scrollElement.clientHeight;
    }

    get scrollWidth () {
        return this.scrollElement.scrollWidth;
    }
    get scrollHeight () {
        return this.scrollElement.scrollHeight;
    }

    // states
    protected _scrollVal: number;
    protected _coordsAtDragStart: {
        left: number;
        top: number;
    }

    // events
    protected _listeners: IAddEventListener[];
    protected _scrollEvent?: IRemovable;
    protected _actionTimeout?: NodeJS.Timeout;
    protected _dragger?: DraggerMove;



    get prop () {
        return this._prop;
    }

    constructor (
        protected _prop: Data,
    ) {
        const {
            prefix, dir, domParent, container, autoHide,
        } = _prop;

        // set default vars
        this._outerHeight = 0;
        this._outerWidth = 0;
        this._thumbHeight = 0;
        this._thumbWidth = 0;
        this._scrollVal = 0;
        this._coordsAtDragStart = {
            left: 0,
            top: 0,
        };
        this._scrollEvent = undefined;
        this._actionTimeout = undefined;
        this._dragger = undefined;

        // create outer
        let outerClassNames = `${prefix} ${prefix}_${dir}`;
        if (container instanceof Window) {
            outerClassNames += ' in-window';
        }
        this._outer = createElement('div', {
            parent: domParent,
            class: outerClassNames,
        });
        // create a thumb
        this._thumb = createElement('div', {
            parent: this._outer,
            class: `${prefix}__thumb ${prefix}__thumb_${dir}`,
        });

        // set auto hide classes
        if (autoHide) {
            this.outer.classList.add('auto-hide');
        }

        // set events
        this._listeners = [];
        this._setEvents();
    }



    get scrollValues () {
        const { container } = this.prop;
        let top = 0;
        let left = 0;
        if (container instanceof Window) {
            top = container.pageYOffset;
            left = container.pageXOffset;
        } else if (container instanceof SmoothScroll) {
            top = container.targetTop;
            left = container.targetLeft;
        } else {
            top = container.scrollTop;
            left = container.scrollLeft;
        }
        return {
            left,
            top,
        };
    }



    /**
     * Set scrolblar events
     */
    protected _setEvents () {
        // set hover events
        this._listeners.push(addEventListener(this.outer, 'mouseenter', this._handleHover.bind(this, true)));
        this._listeners.push(addEventListener(this.outer, 'mouseleave', this._handleHover.bind(this, false)));

        // set scroll events
        this._scrollEvent = onScroll({
            container: this.prop.container,
            callback: (data) => {
                this._handleScroll(data);
            },
        });

        // set dragger
        if (this.prop.isDraggable) {
            this._dragger = new DraggerMove({
                container: this.thumb,
            });
            this._dragger.addCallback('start', () => {
                this.thumb.classList.add('in-action');
                this._disableScrollBehaviour(true);
                this._coordsAtDragStart = this.scrollValues;
            });
            this._dragger.addCallback('move', (data) => {
                this._handleThumbDrag(data);
            });
            this._dragger.addCallback('end', () => {
                this.thumb.classList.remove('in-action');
                this._disableScrollBehaviour(false);
            });
        }
    }

    /**
     * Toggle scrollBehavior: disable & reset smooth scrolling
     */
    protected _disableScrollBehaviour (
        bool: boolean,
    ) {
        const val = bool ? 'auto' : 'unset';
        if (this.prop.container instanceof Window) {
            document.documentElement.style.scrollBehavior = val;
        } else if (this.prop.container instanceof HTMLElement) {
            document.documentElement.style.scrollBehavior = val;
        }
    }

    /**
     * Handle hover state
     */
    protected _handleHover (
        bool: boolean,
    ) {
        this.outer.classList.toggle('is-hovered', bool);
    }

    /**
     * Handle Scroll Event
     */
    protected _handleScroll (data: {
        scrollTop: number;
        scrollLeft: number;
    }) {
        // resize if needed
        if (!this.prop.optimizeCalculations) {
            this.resize();
        }
        // check if changes happened
        let hasChanged = false;
        if (this.isX) {
            hasChanged = data.scrollLeft !== this._scrollVal;
            this._scrollVal = data.scrollLeft;
        } else {
            hasChanged = data.scrollTop !== this._scrollVal;
            this._scrollVal = data.scrollTop;
        }
        if (!hasChanged) {
            return;
        }

        // set auto hide
        if (this.prop.autoHide && hasChanged) {
            this.outer.classList.add('in-action');
            if (this._actionTimeout) {
                clearTimeout(this._actionTimeout);
                this._actionTimeout = undefined;
            }
            this._actionTimeout = setTimeout(() => {
                this.outer.classList.remove('in-action');
            }, 500) as unknown as NodeJS.Timeout;
        }

        // render thumb
        if (this.prop.optimizeCalculations) {
            this._renderThumb();
        }
    }

    /**
     * Event on dragger move
     */
    protected _handleThumbDrag (
        data: NDraggerMove.CallbacksTypes['move'],
    ) {
        data.evt.preventDefault();
        const { container } = this.prop;

        // calculate scroll iterators
        const leftIterator = (
            (data.coords.x - data.start.x) / (this._outerWidth - this._thumbWidth)
        ) * this.scrollLine;
        const topIterator = (
            (data.coords.y - data.start.y) / (this._outerHeight - this._thumbHeight)
        ) * this.scrollLine;

        // calculate new scroll values
        let { left, top } = this._coordsAtDragStart;
        if (this.isX) {
            left += leftIterator;
        } else {
            top += topIterator;
        }

        // apply the values
        container.scrollTo({
            top,
            left,
            behavior: container instanceof SmoothScroll ? this.prop.draggableScrollBehavior : 'auto',
        });
    }

    /**
     * Render the thumb
     */
    protected _renderThumb () {
        // calculate progress
        const progress = boundVal(
            this._scrollVal / this.scrollLine,
            [0, 1],
        );
        // calculate transforms
        const x = this.isX ? (this._outerWidth - this._thumbWidth) * progress : 0;
        const y = this.isY ? (this._outerHeight - this._thumbHeight) * progress : 0;

        // render the thumb
        this._thumb.style.transform = `translate(${x}px, ${y}px)`;
    }



    /**
     * Resize the scene
     */
    public resize () {
        const { outer, thumb, scrollLine } = this;
        const { minSize } = this.prop;

        // get outer sizes
        this._outerHeight = outer.clientHeight;
        this._outerWidth = outer.clientWidth;

        // calculate thumb sizes
        if (this.prop.autoSize) {
            if (this.isX) {
                const barSize = boundVal(
                    this._outerWidth / (this.scrollWidth / (
                        this.scrollWidth - scrollLine
                    )),
                    [minSize, Infinity],
                );
                thumb.style.width = `${barSize}px`;
            } else {
                const barSize = boundVal(
                    this._outerHeight / (this.scrollHeight / (
                        this.scrollHeight - scrollLine
                    )),
                    [minSize, Infinity],
                );
                thumb.style.height = `${barSize}px`;
            }
        }

        // get thumb sizes
        this._thumbHeight = thumb.clientHeight;
        this._thumbWidth = thumb.clientWidth;

        // define if empty
        outer.classList.toggle('is-empty', scrollLine === 0);

        // render the scrollbar thumb
        this._renderThumb();
    }



    public destroy () {
        this._listeners.forEach((listener) => {
            listener.remove();
        });
        if (this._scrollEvent) {
            this._scrollEvent.remove();
        }
        if (this._actionTimeout) {
            clearTimeout(this._actionTimeout);
        }
        if (this._dragger) {
            this._dragger.destroy();
        }
        this._outer.remove();
    }
}
