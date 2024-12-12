import { AnimationFrame as AnimationFrameClass } from '../AnimationFrame';

interface IProps {
  callback: () => void;
  raf: AnimationFrameClass | false;
}

export class AnimationFrame {
  /** Inner animation frame */
  private _raf?: AnimationFrameClass;

  private _event?: () => void;

  private get raf() {
    return (this.props.raf || this._raf)!;
  }

  get ease() {
    return this.raf.fpsMultiplier;
  }

  private get props() {
    return this._props;
  }

  constructor(private _props: IProps) {}

  public enable() {
    // set animation callback for the outer AnimationFrame
    if (this.props.raf) {
      if (!this._event) {
        this._event = this.props.raf.on('frame', () => this.props.callback(), {
          name: 'CustomScroll',
        });
      }

      return;
    }

    // otherwise, check if inner AnimationFrame is created
    if (!this._raf) {
      this._raf = new AnimationFrameClass({ fps: 'auto' });
      this._raf.on('frame', () => this.props.callback());
    }

    // play
    this._raf.play();
  }

  /** Disable scrolling */
  public disable() {
    this._event?.();
    this._event = undefined;

    this._raf?.pause();
  }

  public destroy() {
    this.disable();

    this._raf?.destroy();
  }
}
