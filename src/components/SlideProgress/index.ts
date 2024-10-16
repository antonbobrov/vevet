import { Component as ComponentClass } from '@/base/Component';
import { NSlideProgress } from './types';
import { clamp, lerp } from '@/utils/math';
import { normalizeWheel } from '@/utils/scroll/normalizeWheel';
import { createIsPageScrolling } from '@/utils/scroll/isPageScrolling';
import { AnimationFrame } from '../AnimationFrame';
import { DraggerMove, NDraggerMove } from '../DraggerMove';
import { Timeline } from '../Timeline';
import { NDraggerBase } from '../DraggerBase';

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
      dragThreshold: 3,
    };
  }

  /** Animation frame for smooth animations */
  protected _animationFrame: AnimationFrame;

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
  protected _timelineTo?: Timeline;

  /** Timeout for sticky behavior at the end */
  protected _stickyEndTimeout?: NodeJS.Timeout;

  /** Determines if dragging is allowed */
  protected _canDragMove = false;

  /** Direction of progress */
  protected _direction: 1 | -1 = 1;

  /** Intensity of wheel interaction */
  protected _wheelIntensity = 0;

  /** Current handler for user interactions: 'wheel' or 'drag' */
  protected _currentHandler: 'wheel' | 'drag' = 'wheel';

  /** Checks if the page is scrolling */
  protected _createIsPageScrolling: ReturnType<typeof createIsPageScrolling>;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container } = this.props;

    // Create the animation frame
    this._animationFrame = new AnimationFrame();
    this._animationFrame.addCallback('frame', () =>
      this._handleAnimationFrame(),
    );

    // Create the dragger
    this._dragger = new DraggerMove({ container });
    this._dragger.addCallback('move', (event) => this._handleDrag(event));
    this._dragger.addCallback('start', ({ event }) => event.stopPropagation());
    this._dragger.addCallback('end', () => this._handleDragEnd());

    // Add wheel event listener
    this.addEventListener(container, 'wheel', (event) =>
      this._handleWheel(event),
    );

    // Create page scrolling check
    this._createIsPageScrolling = createIsPageScrolling();

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

    this._dragger.changeProps({ isEnabled: this.props.hasDrag });
  }

  /**
   * Handles wheel events for adjusting progress.
   * @param event - The wheel event.
   */
  protected _handleWheel(event: WheelEvent) {
    if (this._timelineTo || !this.props.hasWheel) {
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

    this._animationFrame.play();

    // Set timeout for sticky behavior
    this._stickyEndTimeout = setTimeout(() => {
      this._wheelIntensity = 0;
      this._goStickyEnd();
    }, 100);

    // Callbacks
    this.callbacks.tbt('wheel', wheel);
  }

  /**
   * Checks if dragging is allowed.
   * @param absDiff - Absolute difference in dragging distance.
   */
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

  /**
   * Handles the drag movement for adjusting progress.
   * @param data - The drag event data.
   */
  protected _handleDrag(data: NDraggerMove.IMoveParameter) {
    const isPageScrolling = this._createIsPageScrolling.get();

    if (this._timelineTo || !this.props.hasDrag || isPageScrolling) {
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

    this._animationFrame.play();

    // Callbacks
    this.callbacks.tbt('dragMove', data);
  }

  /**
   * Handles the end of a drag event and triggers sticky behavior.
   */
  private _handleDragEnd() {
    this._canDragMove = false;

    this._goStickyEnd();
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
    const { fpsMultiplier } = this._animationFrame;

    const nearestSteppedProgress = this._getNearestStep(progress.target);

    if (!this._timelineTo) {
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
        this._animationFrame.pause();
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
      this._progressLerp.target = lerp(startValue, endValue, data.e, 0);
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

  /**
   * Destroys the component and clears all timeouts and resources.
   */
  protected _destroy() {
    super._destroy();

    this._createIsPageScrolling.destroy();

    this._animationFrame.destroy();
    this._dragger.destroy();

    this._timelineTo?.destroy();

    if (this._stickyEndTimeout) {
      clearTimeout(this._stickyEndTimeout);
      this._stickyEndTimeout = undefined;
    }
  }
}
