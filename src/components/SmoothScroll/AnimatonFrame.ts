import { AnimationFrame as AnimationFrameClass } from '../AnimationFrame';
import { NCallbacks } from '@/base/Callbacks';

interface IProps {
  callback: () => void;
  outerAnimationFrame: AnimationFrameClass | false;
}

export class AnimationFrame {
  private _innerAnimationFrame?: AnimationFrameClass;

  private _animationFrameEvent?: NCallbacks.IAddedCallback;

  private get animationFrame() {
    return (this.props.outerAnimationFrame || this._innerAnimationFrame)!;
  }

  get easeMultiplier() {
    return this.animationFrame.easeMultiplier;
  }

  private get props() {
    return this._props;
  }

  constructor(private _props: IProps) {}

  public enable() {
    // set animation callback for the outer AnimationFrame
    if (this.props.outerAnimationFrame) {
      if (!this._animationFrameEvent) {
        this._animationFrameEvent = this.props.outerAnimationFrame.addCallback(
          'frame',
          () => this.props.callback(),
          { name: 'SmoothScroll' }
        );
      }

      return;
    }

    // otherwise, check if inner AnimationFrame is created
    if (!this._innerAnimationFrame) {
      this._innerAnimationFrame = new AnimationFrameClass({ fps: 'auto' });
      this._innerAnimationFrame.addCallback('frame', () =>
        this.props.callback()
      );
    }

    // play
    this._innerAnimationFrame.play();
  }

  /** Disable scrolling */
  public disable() {
    this._animationFrameEvent?.remove();
    this._animationFrameEvent = undefined;

    this._innerAnimationFrame?.pause();
  }

  public destroy() {
    this.disable();

    this._innerAnimationFrame?.destroy();
  }
}
