import { createElement, selectOne } from 'vevet-dom';
import { AnimationFrame } from '../animation-frame/AnimationFrame';
import { Component, NComponent } from '../../base/Component';
import { RequiredModuleProp } from '../../utils/types/utility';
import lerp from '../../utils/math/lerp';



export namespace NCustomCursor {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp {
        /**
         * Cursor parent element
         * @default window
         */
        container?: Window | Element | string;
        /**
         * If need to launch cursor animation after anitialization
         * @default true
         */
        run?: boolean;
        /**
         * If need to hide the native cursor
         * @default false
         */
        hideNativeCursor?: boolean;
    }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
        render?: {
            /**
             * Linear interpolation of coordinates. Speed
             * @default 0.2
             */
            lerp?: number;
            /**
             * Sometimes animation may be choppy because of large decimal values in transforms.
             * In such cases you may want to use this property.
             * It works on the basis of "toFixed()" method. Only integers
             * @default 2
             */
            lerpToFixed?: false | number;
            /**
             * On different screens with different FPS, scrolling may be faster or slower.
             * This property is to normalize scrolling speed across different FPS.
             * @default false
             */
            normalizeLerp?: boolean;
        }
        /**
         * Automatically stop rendering after the target and current values are approximated.
         * @default true
         */
        autoStop?: boolean;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'create': {
            outerCursor: HTMLElement;
            innerCursor: HTMLElement;
        };
        'render': {
            x: number;
            y: number;
        };
    }

}



/**
 * Creates a smooth custom cursor
 */
export class CustomCursor <
    StaticProp extends NCustomCursor.StaticProp = NCustomCursor.StaticProp,
    ChangeableProp extends NCustomCursor.ChangeableProp = NCustomCursor.ChangeableProp,
    CallbacksTypes extends NCustomCursor.CallbacksTypes = NCustomCursor.CallbacksTypes,
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
            run: true,
            hideNativeCursor: false,
            render: {
                lerp: 0.2,
                lerpToFixed: 2,
                normalizeLerp: false,
            },
            autoStop: true,
        };
    }

    get prefix () {
        return `${this._app.prefix}custom-cursor`;
    }



    /**
     * Cursor container
     */
    get container () {
        return this._container;
    }
    protected _container: Element | Window;
    protected _containerIsWindow: boolean;

    /**
     * The element for events
     */
    get eventsContainer () {
        return this._container;
    }

    /**
     * The DOM parent for the cursor element
     */
    get domContainer (): HTMLElement {
        if (this.container instanceof Window) {
            return this._app.html;
        }
        return this.container as HTMLElement;
    }



    /**
     * Cursor element (outer element)
     */
    get outerCursor () {
        return this._outerCursor;
    }
    protected _outerCursor!: HTMLElement;

    /**
     * Cursor element (inner element)
     */
    get innerCursor () {
        return this._innerCursor;
    }
    protected _innerCursor!: HTMLElement;



    /**
     * Animation frame
     */
    protected _animationFrame!: AnimationFrame;
    /**
     * Current FPS. Used to normalize LERP ease
     */
    protected _currentFPS: number;
    /**
     * If can play animation
     */
    protected _canPlay: boolean;

    /**
     * Current X coordinate relative to Window
     */
    get x () {
        return this._x;
    }
    protected _x: number;
    /**
     * Target coordinate
     */
    protected _xTarget: number;

    /**
     * Current Y coordinate relative to Window
     */
    get y () {
        return this._y;
    }
    protected _y: number;
    /**
     * Target coordinate
     */
    protected _yTarget: number;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        // get cursor container
        const container = selectOne(this.prop.container);
        if (container) {
            this._container = container;
        } else {
            throw new Error(`No cursor container for ${this.prop.container}`);
        }
        this._containerIsWindow = container instanceof Window;

        // set default vars
        this._x = 0;
        this._xTarget = 0;
        this._y = 0;
        this._yTarget = 0;
        this._currentFPS = 60;
        this._canPlay = this.prop.run;

        // initialize the class
        if (init) {
            this.init();
        }
    }

    // Extra constructor
    protected _constructor () {
        super._constructor();
        this._createCursor();
    }

    // Set Module Events
    protected _setEvents () {
        super._setEvents();

        const { domContainer } = this;

        // create animation frame
        this._animationFrame = new AnimationFrame();
        this._animationFrame.addCallback('frame', (data) => {
            this._currentFPS = data.realFPS;
            this.render();
        });
        if (this._canPlay) {
            this.enable();
        }

        // set mouse hover events
        this.addEventListeners(domContainer, 'mouseenter', this._handleMouseEnter.bind(this));
        this.addEventListeners(domContainer, 'mouseleave', this._handleMouseLeave.bind(this));
        // set move events
        this.addEventListeners(domContainer, 'mousemove', this._handleMouseMove.bind(this));
        // set click events events
        this.addEventListeners(domContainer, 'mousedown', this._handleMouseDown.bind(this));
        this.addEventListeners(domContainer, 'mouseup', this._handleMouseUp.bind(this));
        this.addEventListeners(window, 'blur', this._handleWindowBlur.bind(this));
    }



    /**
     * Create custom cursor
     */
    protected _createCursor () {
        const { prefix, container, domContainer } = this;

        // hide native cursor
        if (this.prop.hideNativeCursor) {
            domContainer.style.cursor = 'none';
            domContainer.classList.add('hide-defaut-cursor');
        }
        // set classes
        domContainer.classList.add(`${prefix}-container`);

        // create cursor elements
        this._outerCursor = createElement('div', {
            class: `${prefix} ${container instanceof Window ? 'in-window' : 'in-element'} disabled`,
            parent: domContainer,
        });
        this._innerCursor = createElement('div', {
            class: `${prefix}__inner disabled`,
            parent: this._outerCursor,
        });

        // launch events
        this.callbacks.tbt('create', {
            outerCursor: this.outerCursor,
            innerCursor: this.innerCursor,
        });
    }

    /**
     * Destroy the cursor
     */
    protected _destroyCursor () {
        const { prefix, domContainer } = this;

        domContainer.style.cursor = '';
        domContainer.classList.remove('hide-defaut-cursor');
        domContainer.classList.remove(`${prefix}-container`);

        this._outerCursor.remove();
        this._innerCursor.remove();
    }



    /**
     * Event on mouse enter
     */
    protected _handleMouseEnter (
        evt: MouseEvent,
    ) {
        // update coordinates
        this._xTarget = evt.clientX;
        this._x = this._xTarget;
        this._yTarget = evt.clientY;
        this._y = this._yTarget;
        // set classes
        this.outerCursor.classList.add('in-action');
    }

    /**
     * Event on mouse leave
     */
    protected _handleMouseLeave () {
        this.outerCursor.classList.remove('in-action');
    }

    /**
     * Event on mouse move
     */
    protected _handleMouseMove (
        evt: MouseEvent,
    ) {
        this._xTarget = evt.clientX;
        this._yTarget = evt.clientY;
        // set classes
        this.outerCursor.classList.add('in-action');
        // launch animation
        if (this._canPlay) {
            this._animationFrame.play();
        }
    }

    /**
     * Event on mouse down
     */
    protected _handleMouseDown (
        evt: MouseEvent,
    ) {
        if (evt.which === 1) {
            this.outerCursor.classList.add('click');
            this.innerCursor.classList.add('click');
        }
    }

    /**
     * Event on mouse up
     */
    protected _handleMouseUp () {
        this.outerCursor.classList.remove('click');
        this.innerCursor.classList.remove('click');
    }

    /**
     * Event on mouse down
     */
    protected _handleWindowBlur () {
        this._handleMouseUp();
    }



    /**
     * Render the scene
     */
    public render () {
        // props
        const { prop } = this;
        const { domContainer } = this;
        const { normalizeLerp, lerp: ease, lerpToFixed } = prop.render;
        const fpsMultiplier = normalizeLerp ? 60 / this._currentFPS : 1;

        // interpolate coordinates
        this._x = lerp(this._x, this._xTarget, ease * fpsMultiplier, 0.02);
        this._y = lerp(this._y, this._yTarget, ease * fpsMultiplier, 0.02);
        // round the values
        if (typeof lerpToFixed === 'number') {
            const fixed = Math.round(Math.abs(lerpToFixed));
            this._x = parseFloat(this._x.toFixed(fixed));
            this._y = parseFloat(this._y.toFixed(fixed));
        }

        // calculate real coordinates
        let x = this._x;
        let y = this._y;
        if (!this._containerIsWindow) {
            const bounding = domContainer.getBoundingClientRect();
            x -= bounding.left;
            y -= bounding.top;
        }

        // update dom coordinates
        this.outerCursor.style.transform = `translate(${x}px, ${y}px)`;

        // auto stop
        if (
            prop.autoStop
            && this._x === this._xTarget && this._y === this._yTarget
        ) {
            this._animationFrame.pause();
        }

        // launch render events
        this._callbacks.tbt('render', { x, y });
    }



    /**
     * Enable cursor
     */
    public enable () {
        this._canPlay = true;
        if (this._animationFrame.isPlaying) {
            return;
        }
        this.outerCursor.classList.remove('disabled');
        this.innerCursor.classList.remove('disabled');
        this._animationFrame.play();
    }


    /**
     * Disable cursor
     */
    public disable () {
        this._canPlay = false;
        if (!this._animationFrame.isPlaying) {
            return;
        }
        this.outerCursor.classList.add('disabled');
        this.innerCursor.classList.add('disabled');
        this._animationFrame.pause();
    }



    /**
     * Destroy the module
     */
    protected _destroy () {
        super._destroy();
        this._destroyCursor();
        this._animationFrame.destroy();
    }
}
