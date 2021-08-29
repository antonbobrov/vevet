import { addEventListener, createElement, IAddEventListener } from 'vevet-dom';
import { IRemovable } from '../../../utils/types/general';
import onScroll from '../../../utils/listeners/onScroll';
import boundVal from '../../../utils/math/boundVal';
import { NScrollBar } from './ScrollBar';

interface Data {
    container: Required<NScrollBar.StaticProp>['container'];
    domParent: Element;
    dir: 'x' | 'y';
    autoHide: boolean;
    autoSize: boolean;
    minSize: number;
    prefix: string;
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

    // events
    protected _listeners: IAddEventListener[];
    protected _scrollEvent?: IRemovable;
    protected _actionTimeout?: NodeJS.Timeout;



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



    /**
     * Set scrolblar events
     */
    protected _setEvents () {
        // set hover events
        this._listeners.push(addEventListener(this.outer, 'mouseenter', this._handleHover.bind(this, true)));
        this._listeners.push(addEventListener(this.outer, 'mouseleave', this._handleHover.bind(this, false)));

        // set scroll events
        this._scrollEvent = onScroll(this.prop.container, (data) => {
            this._handleScroll(data);
        });
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
        this._renderThumb();
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
    }
}
