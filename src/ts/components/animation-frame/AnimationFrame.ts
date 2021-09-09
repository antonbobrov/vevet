import { Component, NComponent } from '../../base/Component';
import { boundVal } from '../../utils/math';
import { RequiredModuleProp } from '../../utils/types/utility';



export namespace NAnimationFrame {

    /**
     * Static properties
     */
    export interface StaticProp extends NComponent.StaticProp { }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NComponent.ChangeableProp {
        /**
         * Frames per second
         * @default 140
         */
        fps?: number;
        /**
         * If need to start the frame
         * @default true
         */
        run?: boolean;
    }

    /**
     * Available callbacks
     */
    export interface CallbacksTypes extends NComponent.CallbacksTypes {
        'frame': {
            fps: number;
            realFPS: number;
            prevFrameDuration: number;
        };
    }

}



/**
 * Launch an animation frame with a certain FPS
 */
export class AnimationFrame <
    StaticProp extends NAnimationFrame.StaticProp = NAnimationFrame.StaticProp,
    ChangeableProp extends NAnimationFrame.ChangeableProp = NAnimationFrame.ChangeableProp,
    CallbacksTypes extends NAnimationFrame.CallbacksTypes = NAnimationFrame.CallbacksTypes,
> extends Component <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {
    /**
     * If the frame is launched
     */
    protected _isPlaying: boolean;
    get isPlaying () {
        return this._isPlaying;
    }

    /**
     * The animation frame
     */
    protected _frame: number | null;


    /**
     * Previous frame segment
     */
     protected _frameIndex: number;

    /**
     * Timestamp
     */
    protected _timeStamp: null | number;
    /**
     * Previous frame duration
     */
    protected _prevFrameTime: null | number;



    constructor (
        initialProp?: (StaticProp & ChangeableProp),
        init = true,
    ) {
        super(initialProp, false);

        this._isPlaying = false;
        this._frame = null;
        this._frameIndex = -1;
        this._timeStamp = null;
        this._prevFrameTime = null;

        if (init) {
            this.init();
        }
    }

    /**
     * Get default properties
     */
    protected _getDefaultProp <
        T extends RequiredModuleProp<StaticProp & ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            fps: 140,
            run: false,
        };
    }

    // Extra constructor
    protected _constructor () {
        super._constructor();
        this._create();
    }



    /**
     * Create the frame
     */
    protected _create () {
        if (this.prop.run) {
            this.play();
        }
    }

    protected _onPropMutate () {
        this._frameIndex = -1;
        this._timeStamp = null;
        this._prevFrameTime = null;
        if (this.prop.run) {
            this._play();
        } else {
            this._pause();
        }
    }



    /**
     * Launch the animation frame.
     */
    public play () {
        if (this.destroyed) {
            return;
        }
        if (this.prop.run) {
            return;
        }
        this.changeProp({
            run: true,
        } as ChangeableProp);
    }

    /**
     * Launch the animation frame.
     */
    protected _play () {
        // check if already playing
        if (this.isPlaying) {
            return;
        }
        this._isPlaying = true;
        // launch animation
        this._frame = window.requestAnimationFrame(this._animate.bind(this));
    }



    /**
     * Stop the animation frame
     */
    public pause () {
        if (!this.prop.run) {
            return;
        }
        this.changeProp({
            run: false,
        } as ChangeableProp);
    }

    /**
     * Stop the animation frame
     */
    protected _pause () {
        if (!this.isPlaying) {
            return;
        }
        // cancel animation frame
        if (this._frame) {
            window.cancelAnimationFrame(this._frame);
            this._frame = null;
        }
        // bool
        this._isPlaying = false;
    }



    /**
     * Launch the animation frame.
     */
    protected _animate (
        timestamp: number,
    ) {
        if (!this._isPlaying) {
            return;
        }

        // launch animation
        this._frame = window.requestAnimationFrame(this._animate.bind(this));

        // update variables
        const currentTime = +new Date();
        if (this._timeStamp == null) {
            this._timeStamp = timestamp;
        }
        if (this._prevFrameTime == null) {
            this._prevFrameTime = currentTime;
        }

        // calculate frame index
        const newFrameIndex = Math.floor((timestamp - this._timeStamp) / (1000 / this.prop.fps));
        if (newFrameIndex <= this._frameIndex) {
            return;
        }

        // update frame index
        this._frameIndex = newFrameIndex;

        // calculate real fps
        const timeDiff = currentTime - this._prevFrameTime;
        const realFPS = boundVal(
            timeDiff === 0 ? 1000 / 60 : Math.floor(1000 / timeDiff),
            [1, Infinity],
        );

        // launch callbacks
        this.callbacks.tbt('frame', {
            fps: this.prop.fps,
            realFPS,
            prevFrameDuration: currentTime - this._prevFrameTime,
        });

        this._prevFrameTime = +new Date();
    }



    /**
     * Destroy the animation frame
     */
    protected _destroy () {
        this.pause();
        super._destroy();
    }
}
