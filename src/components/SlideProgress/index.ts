import { Component as ComponentClass } from '@/base/Component';
import { NSlideProgress } from './types';
import { clamp, lerp } from '@/utils/math';
import { normalizeWheel } from '@/utils/scroll/normalizeWheel';
import { AnimationFrame } from '../AnimationFrame';
import { DraggerMove, NDraggerMove } from '../DraggerMove';
import { Timeline } from '../Timeline';

export type { NSlideProgress };

/**
 * Slide progress handler.
 * This class manages sliding progress with options like dragging, wheel interactions, and smooth transitions.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/slide-progress/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/SlideProgress.html
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
      dragThreshold: 5,
    };
  }

  /** Animation frame for smooth animations */
  protected _raf: AnimationFrame;

  /** Dragging behavior manager */
  protected _dragger: DraggerMove;

  /** Stores the current and target progress values */
  protected _progressLerp: NSlideProgress.IWithLerp = { current: 0, target: 0 };

  /**
   * Gets the current progress value.
   */
  get progress() {
    return this._progressLerp.current;
  }

  /**
   * Gets the nearest stepped progress value.
   */
  get steppedProgress() {
    return this._getNearestStep(this._progressLerp.current);
  }

  /** Timeline for smooth transitions */
  protected _timeline?: Timeline;

  /** Timeout for sticky behavior at the end */
  protected _stickyEndTimeout?: NodeJS.Timeout;

  /** Direction of progress */
  protected _direction: 1 | -1 = 1;

  /** Intensity of wheel interaction */
  protected _wheelIntensity = 0;

  /** Current handler for user interactions: 'wheel' or 'drag' */
  protected _currentHandler: 'wheel' | 'drag' = 'wheel';

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container, hasDrag, dragDirection, dragThreshold } = this.props;

    // Create the animation frame
    this._raf = new AnimationFrame();
    this._raf.addCallback('frame', () => this._handleAnimationFrame());

    // Create dragger
    this._dragger = new DraggerMove({
      container,
      isEnabled: hasDrag,
      threshold: dragThreshold,
    });

    this._dragger.addCallback('move', (event) => this._handleDrag(event));
    this._dragger.addCallback('start', ({ event }) => event.stopPropagation());
    this._dragger.addCallback('end', () => this._handleDragEnd());

    // Touch Action
    container.style.touchAction = dragDirection === 'x' ? 'pan-y' : 'pan-x';

    // Add wheel event listener
    this.addEventListener(container, 'wheel', (event) =>
      this._handleWheel(event),
    );

    // Initialize the class
    if (canInit) {
      this.init();
    }
  }

  /**
   * Handles mutation of properties.
   */
  protected _onPropsMutate() {
    super._onPropsMutate();

    const { container, hasDrag, dragThreshold, dragDirection } = this.props;

    this._dragger.changeProps({ isEnabled: hasDrag, threshold: dragThreshold });

    container.style.touchAction = dragDirection === 'x' ? 'pan-y' : 'pan-x';
  }

  /**
   * Handles wheel events for adjusting progress.
   * @param event - The wheel event.
   */
  protected _handleWheel(event: WheelEvent) {
    if (this._timeline || !this.props.hasWheel) {
      return;
    }

    // Clear sticky timeout
    if (this._stickyEndTimeout) {
      clearTimeout(this._stickyEndTimeout);
      this._stickyEndTimeout = undefined;
    }

    // Vars
    const { _progressLerp: progress } = this;
    const { container, min, max, wheelSpeed } = this.props;

    // Update handler
    this._currentHandler = 'wheel';

    // Normalize wheel data
    const wheel = normalizeWheel(event);
    const y = (wheel.pixelY / container.clientHeight) * wheelSpeed;

    // Update direction and target progress
    this._wheelIntensity += y;
    this._direction = this._wheelIntensity > 0 ? 1 : -1;
    progress.target = clamp(progress.target + y, [min, max]);

    // play animation
    this._raf.play();

    // Set timeout for sticky behavior
    this._stickyEndTimeout = setTimeout(() => {
      this._wheelIntensity = 0;
      this._goStickyEnd();
    }, 100);

    // Callbacks
    this.callbacks.tbt('wheel', wheel);
  }

  /**
   * Handles the drag movement for adjusting progress.
   * @param data - The drag event data.
   */
  protected _handleDrag(data: NDraggerMove.IMoveParameter) {
    if (this._timeline) {
      return;
    }

    const { _progressLerp: progress, props } = this;
    const { container, dragSpeed, dragDirection, min, max } = props;
    const { step, diff } = data;

    // Update handler
    this._currentHandler = 'drag';

    // Drag logic
    const defaultIterator = dragDirection === 'y' ? step.y : step.x;
    const iteratorDivider =
      dragDirection === 'y' ? container.clientHeight : container.clientWidth;

    const iterator = (defaultIterator * dragSpeed) / iteratorDivider;
    progress.target = clamp(progress.target - iterator, [min, max]);

    const dragDiff = dragDirection === 'y' ? diff.y : diff.x;
    this._direction = dragDiff < 0 ? 1 : -1;

    this._raf.play();

    // Callbacks
    this.callbacks.tbt('dragMove', data);
  }

  /**
   * Handles the end of a drag event and triggers sticky behavior.
   */
  private _handleDragEnd() {
    this._goStickyEnd();

    // Callbacks
    this.callbacks.tbt('dragEnd', undefined);
  }

  /**
   * Gets the nearest step value to the given progress value.
   * @param value - The progress value.
   */
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

  /**
   * Handles the animation frame and updates the progress values.
   */
  protected _handleAnimationFrame() {
    const { _progressLerp: progress } = this;
    const { ease, friction, step } = this.props;
    const { fpsMultiplier } = this._raf;

    const nearestSteppedProgress = this._getNearestStep(progress.target);

    if (!this._timeline) {
      progress.target = lerp(
        progress.target,
        nearestSteppedProgress,
        friction * ease * fpsMultiplier,
        0,
      );

      this._updateCurrentProgress(ease * fpsMultiplier);

      if (
        progress.current === progress.target &&
        progress.current % step === 0
      ) {
        this._raf.pause();
      }
    }

    this.render();
  }

  /**
   * Renders the component and triggers any necessary callbacks.
   */
  public render() {
    this.callbacks.tbt('render', undefined);
  }

  /**
   * Updates the current progress and triggers callbacks if necessary.
   * @param ease - The ease value for interpolation.
   */
  protected _updateCurrentProgress(ease: number) {
    const progress = this._progressLerp;

    const prevSteppedProgress = this._getNearestStep(progress.current);

    progress.current = lerp(progress.current, progress.target, ease, 0);

    const nextSteppedProgress = this._getNearestStep(progress.current);

    if (prevSteppedProgress !== nextSteppedProgress) {
      this.callbacks.tbt('step', undefined);
    }
  }

  /**
   * Sticks the progress to the nearest step at the end of user interaction.
   */
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

  /**
   * Animates the progress to a specific value.
   */
  public to({
    value: endValue,
    duration: durationProp = 500,
    onProgress,
    onEnd,
  }: NSlideProgress.IToProps) {
    this._timeline?.destroy();

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
    this._timeline = timeline;

    timeline.addCallback('progress', (data) => {
      this._progressLerp.target = lerp(startValue, endValue, data.e, 0);
      this._updateCurrentProgress(1);

      onProgress?.(data);
    });

    timeline.addCallback('end', () => {
      this._timeline?.destroy();
      this._timeline = undefined;

      onEnd?.();
    });

    timeline.play();

    this._raf.play();
  }

  /**
   * Destroys the component and clears all timeouts and resources.
   */
  protected _destroy() {
    super._destroy();

    this._raf.destroy();
    this._dragger.destroy();

    this._timeline?.destroy();

    if (this._stickyEndTimeout) {
      clearTimeout(this._stickyEndTimeout);
      this._stickyEndTimeout = undefined;
    }
  }
}
