import { Raf } from '@/components/Raf';
import { Timeline } from '@/components/Timeline';
import { isNumber, ModulePart } from '@/internal';
import { lerp } from '@/utils/math';

import { Snap } from '../..';
import { LERP_APPROXIMATION } from '../../constants';

import { ICtx, ISnapTransitionArg } from './types';

/**
 * RAF track interpolation and Timeline transitions.
 *
 * @internal
 */
export class SnapAnimation extends ModulePart<Snap> {
  private _raf: Raf;

  private _tm?: Timeline;

  constructor(
    parent: Snap,
    private _ctx: ICtx,
  ) {
    super(parent);

    this._raf = new Raf();

    this._raf.on('play', () => this.callbacks.emit('rafPlay', undefined));
    this._raf.on('pause', () => this.callbacks.emit('rafPause', undefined));
    this._raf.on('frame', this._handleRaf.bind(this));

    this.onDestroy(() => {
      this._raf.destroy();
      this.cancelTransition();
    });
  }

  get transitioning() {
    return !!this._tm;
  }

  private get interpolated() {
    return (
      this._ctx.getCurrent() === this._ctx.getTarget() &&
      this._ctx.getImpulse().current === 0
    );
  }

  get interpolating() {
    const diff = Math.abs(this._ctx.getTarget() - this._ctx.getCurrent());

    return diff > LERP_APPROXIMATION;
  }

  private _handleRaf() {
    if (this.transitioning) {
      return;
    }

    const { props, _raf: raf } = this;

    const ease = raf.lerpFactor(props.lerp);
    this._lerp(ease);

    if (this.interpolated) {
      raf.pause();
    }

    this.callbacks.emit('rafFrame', undefined);

    this._ctx.onRender(raf.duration);
  }

  private _lerp(initialFactor: number) {
    let lerpFactor = initialFactor;

    const target = this._ctx.getTarget();
    const current = this._ctx.getCurrent();
    const impulse = this._ctx.getImpulse();

    const rest = Math.abs(current - target);
    const fastThreshold = 3;

    // Ease in harder when close to the target to avoid endless micro-lerp
    if (rest < fastThreshold) {
      const fastProgress = 1 - rest / fastThreshold;
      const additionalFactor = (1 - lerpFactor) / 15;
      lerpFactor += additionalFactor * fastProgress;
    }

    this._ctx.setCurrent(lerp(current, target, lerpFactor, LERP_APPROXIMATION));

    impulse.target = lerp(impulse.target, 0, lerpFactor, LERP_APPROXIMATION);
    impulse.current = lerp(
      impulse.current,
      impulse.target,
      lerpFactor,
      LERP_APPROXIMATION,
    );
  }

  public awake() {
    this._raf.play();
  }

  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    if (this.isDestroyed) {
      return false;
    }

    const { props } = this;

    this.cancelTransition();

    const start = this._ctx.getCurrent();
    const end = coordinate;
    const diff = Math.abs(end - start);

    const durationProp = options?.duration ?? props.duration;

    let duration = isNumber(durationProp) ? durationProp : durationProp(diff);
    if (diff === 0) {
      duration = 0;
    }

    const easing = options?.easing ?? props.easing;

    const tm = new Timeline({ duration, easing });

    this._tm = tm;

    tm.on('start', () => {
      this.callbacks.emit('timelineStart', undefined);
      options?.onStart?.();
    });

    tm.on('update', (data) => {
      const impulse = this._ctx.getImpulse();

      this._ctx.setCurrent(lerp(start, end, data.eased));
      this._ctx.setTarget(this._ctx.getCurrent());

      impulse.current = impulse.current * (1 - data.progress);
      impulse.target = impulse.current;

      if (data.progress === 1) {
        this._ctx.onTmReset();
        this._tm = undefined;
      }

      this.callbacks.emit('timelineUpdate', data);

      this._ctx.onRender();
      options?.onUpdate?.(data);
    });

    tm.on('end', () => {
      tm.destroy();

      this.callbacks.emit('timelineEnd', undefined);
      options?.onEnd?.();
    });

    tm.on('destroy', () => this._ctx.onTmReset());

    tm.play();

    return true;
  }

  public cancelTransition() {
    this._tm?.destroy();
    this._tm = undefined;
  }
}
