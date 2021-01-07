import { Module, NModule } from '../../base/Module';
import { mergeWithoutArrays } from '../../utils/common';

/**
 * Launch an animation frame with a certain FPS
 */
export class AnimationFrame <
    StaticProp extends NAnimationFrame.StaticProp = NAnimationFrame.StaticProp,
    ChangeableProp extends NAnimationFrame.ChangeableProp = NAnimationFrame.ChangeableProp,
    CallbacksTypes extends NAnimationFrame.CallbacksTypes = NAnimationFrame.CallbacksTypes,
> extends Module <
    StaticProp,
    ChangeableProp,
    CallbacksTypes
> {



    get defaultProp () {
        const prop: Required<
            Omit<
                NAnimationFrame.StaticProp & NAnimationFrame.ChangeableProp,
                keyof (NModule.StaticProp & NModule.ChangeableProp)
            >
        > = {
            fps: 60,
            run: true,
        };
        return mergeWithoutArrays(super.defaultProp, prop);
    }



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

        this._frameSeg = -1;

        if (this.prop.run) {
            this._play();
        }
        else {
            this._pause();
        }

    }



    /**
     * Launch the animation frame.
     */
    public play () {
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
            this.callbacks.tbt('', false);
        }

    }



}



export namespace NAnimationFrame {

    /**
     * Static properties
     */
    export interface StaticProp extends NModule.StaticProp { }

    /**
     * Changeable properties
     */
    export interface ChangeableProp extends NModule.ChangeableProp {
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
    export interface CallbacksTypes extends NModule.CallbacksTypes {
        '': false;
    }

}
