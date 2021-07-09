import { Component, NComponent } from '../../base/Component';
import { mergeWithoutArrays } from '../../utils/common';
import { DeepRequired } from '../../utils/types/utility';



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
         * @default 60
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
        'frame': false;
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
    get isPlaying () {
        return this._isPlaying;
    }

    protected _isPlaying = false;

    /**
     * The animation frame
     */
    protected _frame: number | null = null;

    /**
     * Previous frame segment
     */
    protected _frameSeg = -1;

    /**
     * Timestamp
     */
    protected _time: null | number = null;



    /**
     * Get default properties
     */
    protected _getDefaultProp () {
        const prop: DeepRequired<
            Omit<
                NAnimationFrame.StaticProp & NAnimationFrame.ChangeableProp,
                keyof (NComponent.StaticProp & NComponent.ChangeableProp)
            >
        > = {
            fps: 60,
            run: false,
        };
        return mergeWithoutArrays(super._getDefaultProp(), prop);
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
        this._isPlaying = this.prop.run;
        if (this.prop.run) {
            this.play();
        }
    }

    protected _onPropMutate () {
        this._frameSeg = -1;

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
        if (this._destroyed) {
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

        // request animation frame
        this._animate();
    }



    /**
     * Stop the animation frame
     */
    public pause () {
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
        timestamp = 0,
    ) {
        // launch animation
        this._frame = window.requestAnimationFrame(this._animate.bind(this));

        // update current time
        if (this._time == null) {
            this._time = timestamp;
        }

        // calculate frame segment
        const seg = Math.floor((timestamp - this._time) / (1000 / this.prop.fps));
        if (seg > this._frameSeg) {
            this._frameSeg = seg;
            // trigger callbakcs
            this.callbacks.tbt('frame', false);
        }
    }



    /**
     * Destroy the animation frame
     */
    protected _destroy () {
        this.pause();
        super._destroy();
    }
}
