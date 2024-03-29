import { Component as ComponentClass } from '@/base/Component';
import { NSlideProgress } from './types';
import { clamp, lerp } from '@/utils/math';
import { normalizeWheel } from '@/utils/scroll/normalizeWheel';
import { isPageScrolling } from '@/utils/scroll/isPageScrolling';
import { AnimationFrame } from '../AnimationFrame';
import { DraggerMove, NDraggerMove } from '../DraggerMove';
import { Timeline } from '../Timeline';
import { NDraggerBase } from '../DraggerBase';

export type { NSlideProgress };

/**
 * Slide progress handler
 */
export class SlideProgress<
  StaticProps extends NSlideProgress.IStaticProps = NSlideProgress.IStaticProps,
  ChangeableProps extends
    NSlideProgress.IChangeableProps = NSlideProgress.IChangeableProps,
  CallbacksTypes extends
    NSlideProgress.ICallbacksTypes = NSlideProgress.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      min: 0,
      max: 3,
      step: 1,
      stepThreshold: 0.1,
      ease: 0.1,
      friction: 0.5,
      hasDrag: true,
      dragSpeed: 1,
      dragDirection: 'y',
      hasWheel: true,
      wheelSpeed: 1,
      stickyEndDuration: 500,
      dragThreshold: 3,
    };
  }

  /** Animation frame */
  protected _animationFrame: AnimationFrame;

  /** Dragger events */
  protected _dragger: DraggerMove;

  /** Progress (current and target) */
  protected _progressLerp: NSlideProgress.IWithLerp = { current: 0, target: 0 };

  /** Progress */
  get progress() {
    return this._progressLerp.current;
  }

  /** Stepped progress */
  get steppedProgress() {
    return this._getNearestStep(this._progressLerp.current);
  }

  /** Progress timeline */
  protected _timelineTo?: Timeline;

  /** Sticky timeout */
  protected _stickyEndTimeout?: NodeJS.Timeout;

  /** Can drag */
  protected _canDragMove = false;

  /** Direction */
  protected _direction: 1 | -1 = 1;

  /** Wheel intensity */
  protected _wheelIntensity = 0;

  /** Current handler */
  protected _currentHandler: 'wheel' | 'drag' = 'wheel';

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container } = this.props;

    // create animation frame
    this._animationFrame = new AnimationFrame();
    this._animationFrame.addCallback('frame', () =>
      this._handleAnimationFrame(),
    );

    // create dragger
    this._dragger = new DraggerMove({ container });
    this._dragger.addCallback('move', (event) => this._handleDrag(event));
    this._dragger.addCallback('start', ({ event }) => event.stopPropagation());
    this._dragger.addCallback('end', () => this._handleDragEnd());

    // add wheel event
    this.addEventListener(container, 'wheel', (event) =>
      this._handleWheel(event),
    );

    // initialize the class
    if (canInit) {
      this.init();
    }
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this._dragger.changeProps({ isEnabled: this.props.hasDrag });
  }

  /** Handle wheel event */
  protected _handleWheel(event: WheelEvent) {
    if (this._timelineTo || !this.props.hasWheel) {
      return;
    }

    // clear sticky timeout
    if (this._stickyEndTimeout) {
      clearTimeout(this._stickyEndTimeout);
      this._stickyEndTimeout = undefined;
    }

    // vars
    const { _progressLerp: progress } = this;
    const { container, min, max, wheelSpeed } = this.props;

    // update handler
    this._currentHandler = 'wheel';

    // normalize wheel
    const wheel = normalizeWheel(event);
    const y = (wheel.pixelY / container.clientHeight) * wheelSpeed;

    // update direction
    this._wheelIntensity += y;
    this._direction = this._wheelIntensity > 0 ? 1 : -1;

    // update target
    progress.target = clamp(progress.target + y, [min, max]);
    this._animationFrame.play();

    // go sticky
    this._stickyEndTimeout = setTimeout(() => {
      this._wheelIntensity = 0;
      this._goStickyEnd();
    }, 100);

    // callbacks
    this.callbacks.tbt('wheel', wheel);
  }

  /** Check if can move */
  protected _checkCanDragMove(absDiff: NDraggerBase.IVector2) {
    const { dragDirection, dragThreshold } = this.props;

    if (this._canDragMove) {
      return true;
    }

    if (absDiff.x < dragThreshold && absDiff.y < dragThreshold) {
      return false;
    }

    if (dragDirection === 'x' && absDiff.x > absDiff.y) {
      this._canDragMove = true;
    }

    if (dragDirection === 'y' && absDiff.y > absDiff.x) {
      this._canDragMove = true;
    }

    return false;
  }

  /** Handle drag move event */
  protected _handleDrag(data: NDraggerMove.IMoveParameter) {
    if (this._timelineTo || !this.props.hasDrag || isPageScrolling()) {
      return;
    }

    if (!this._checkCanDragMove(data.absDiff)) {
      return;
    }

    const { _progressLerp: progress, props } = this;
    const { container, dragSpeed, dragDirection, min, max } = props;
    const { event, step, diff } = data;

    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();

    // update handler
    this._currentHandler = 'drag';

    // drag logic

    const defaultIterator = dragDirection === 'y' ? step.y : step.x;
    const iteratorDivider =
      dragDirection === 'y' ? container.clientHeight : container.clientWidth;

    const iterator = (defaultIterator * dragSpeed) / iteratorDivider;
    progress.target = clamp(progress.target - iterator, [min, max]);

    const dragDiff = dragDirection === 'y' ? diff.y : diff.x;
    this._direction = dragDiff < 0 ? 1 : -1;

    this._animationFrame.play();

    // callbacks
    this.callbacks.tbt('dragMove', data);
  }

  /** Handler drag end event */
  private _handleDragEnd() {
    this._canDragMove = false;

    this._goStickyEnd();
  }

  /** Get nearest stepped value to given progress */
  protected _getNearestStep(value: number) {
    const { step, stepThreshold: stepThresholdProp, dragSpeed } = this.props;
    const threshold = clamp(stepThresholdProp, [0.001, 0.5]);

    let direction = this._direction as number;
    if (this._currentHandler === 'drag') {
      direction = dragSpeed < 0 ? this._direction * -1 : this._direction;
    }

    const diff =
      direction === 1
        ? Math.abs(value - Math.floor(value / step) * step)
        : Math.abs(value - Math.ceil(value / step) * step);

    if (diff > threshold) {
      if (direction === 1) {
        return Math.ceil(value / step) * step;
      }

      return Math.floor(value / step) * step;
    }

    return Math.round(value / this.props.step) * this.props.step;
  }

  /** Callback on animation frame */
  protected _handleAnimationFrame() {
    const { _progressLerp: progress } = this;
    const { ease, friction, step } = this.props;
    const { easeMultiplier } = this._animationFrame;

    const nearestSteppedProgress = this._getNearestStep(progress.target);

    if (!this._timelineTo) {
      progress.target = lerp(
        progress.target,
        nearestSteppedProgress,
        friction * ease * easeMultiplier,
        0,
      );

      this._updateCurrentProgress(ease * easeMultiplier);

      if (
        progress.current === progress.target &&
        progress.current % step === 0
      ) {
        this._animationFrame.pause();
      }
    }

    this.render();
  }

  /** Render scene */
  public render() {
    this.callbacks.tbt('render', undefined);
  }

  /** Interpolate current progress & launch callbacks if needed */
  protected _updateCurrentProgress(ease: number) {
    const progress = this._progressLerp;

    const prevSteppedProgress = this._getNearestStep(progress.current);

    progress.current = lerp(progress.current, progress.target, ease, 0);

    const nextSteppedProgress = this._getNearestStep(progress.current);

    if (prevSteppedProgress !== nextSteppedProgress) {
      this.callbacks.tbt('step', undefined);
    }
  }

  /** Sticky to the nearest step */
  protected _goStickyEnd() {
    const { stickyEndDuration } = this.props;

    if (!stickyEndDuration) {
      return;
    }

    const startValue = this._progressLerp.current;
    const endValue = this._getNearestStep(startValue);

    if (startValue === endValue) {
      return;
    }

    this.to({
      value: endValue,
      duration:
        typeof stickyEndDuration === 'number'
          ? stickyEndDuration * 2
          : stickyEndDuration,
    });
  }

  /** Animate progress to a certain value */
  public to({
    value: endValue,
    duration: durationProp = 500,
    onProgress,
    onEnd,
  }: NSlideProgress.IToProps) {
    this._timelineTo?.destroy();

    const startValue = this._progressLerp.current;
    const diff = Math.abs(startValue - endValue);
    const multiplier = diff / this.props.step;

    const duration = Math.max(
      typeof durationProp === 'number'
        ? durationProp * multiplier
        : durationProp(multiplier),
      100,
    );

    const timeline = new Timeline({ duration });
    this._timelineTo = timeline;

    timeline.addCallback('progress', (data) => {
      this._progressLerp.target = lerp(startValue, endValue, data.easing, 0);
      this._updateCurrentProgress(1);

      onProgress?.(data);
    });

    timeline.addCallback('end', () => {
      this._timelineTo?.destroy();
      this._timelineTo = undefined;

      onEnd?.();
    });

    timeline.play();

    this._animationFrame.play();
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._animationFrame.destroy();
    this._dragger.destroy();

    this._timelineTo?.destroy();

    if (this._stickyEndTimeout) {
      clearTimeout(this._stickyEndTimeout);
      this._stickyEndTimeout = undefined;
    }
  }
}
