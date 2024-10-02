import { selectOne } from 'vevet-dom';
import type { CustomScroll } from '../CustomScroll';
import { NScrollSectionProgress } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { clampScope } from '@/utils/math';
import { IGetScrollValues, getScrollValues, onScroll } from '@/utils/scroll';
import { onResize } from '@/utils/listeners/onResize';
import { getApp } from '@/utils/internal/getApp';

export type { NScrollSectionProgress };

/**
 * `SectionScrollProgress` is a component that traces the scroll progress of a specified section.
 * It provides the progress of entering the viewport, moving within it, and exiting it.
 */
export class SectionScrollProgress<
  StaticProps extends
    NScrollSectionProgress.IStaticProps = NScrollSectionProgress.IStaticProps,
  ChangeableProps extends
    NScrollSectionProgress.IChangeableProps = NScrollSectionProgress.IChangeableProps,
  CallbacksTypes extends
    NScrollSectionProgress.ICallbacksTypes = NScrollSectionProgress.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      scrollContainer: window,
      viewportTarget: 'any',
      resizeTimeout: 0,
    };
  }

  /**
   * The container element in which the section is being scrolled.
   */
  protected _scrollContainer: Element | CustomScroll | Window;

  /**
   * Returns the scroll container.
   *
   * @returns {Element | CustomScroll | Window} The scroll container.
   */
  get scrollContainer() {
    return this._scrollContainer;
  }

  /**
   * The section element that is being tracked for scroll progress.
   */
  protected _section: Element;

  /**
   * Returns the section element being tracked.
   */
  get section() {
    return this._section;
  }

  /**
   * Global scope of the scrolling section, from the point it enters to the point it exits the viewport.
   */
  protected _scopeGlobal: [number, number];

  /**
   * Returns the global scope of the scrolling section.
   */
  get scopeGlobal() {
    return this._scopeGlobal;
  }

  /**
   * Scope representing the section appearing from the bottom to the top of the viewport.
   */
  protected _scopeIn: [number, number];

  /**
   * Returns the scope of the section appearing in the viewport.
   */
  get scopeIn() {
    return this._scopeIn;
  }

  /**
   * Scope representing the movement of the section within the viewport.
   */
  protected _scopeMove: [number, number];

  /**
   * Returns the scope of the section moving through the viewport.
   */
  get scopeMove() {
    return this._scopeMove;
  }

  /**
   * Scope representing the section disappearing from the viewport, from bottom to top.
   */
  protected _scopeOut: [number, number];

  /**
   * Returns the scope of the section disappearing from the viewport.
   */
  get scopeOut() {
    return this._scopeOut;
  }

  /**
   * Tracks the previous progress of the global scroll.
   */
  protected _prevProgressGlobal: number;

  /**
   * Tracks the current global progress of the scroll through the section.
   */
  protected _progressGlobal: number;

  /**
   * Returns the current global progress of the scroll.
   */
  get progressGlobal() {
    return this._progressGlobal;
  }

  protected set progressGlobal(value) {
    this._progressGlobal = value;
  }

  /**
   * Throttling index to control how often the section's rendering calculations are performed.
   */
  protected _frameThrottleIndex: number;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { scrollContainer, section } = this.props;

    // Get the scroll container
    if (typeof scrollContainer === 'string') {
      this._scrollContainer = selectOne(scrollContainer) as Element;
    } else {
      this._scrollContainer = scrollContainer as any;
    }

    // Get the section element
    this._section = selectOne(section) as Element;

    // Set default values
    this._prevProgressGlobal = -0.001;
    this._progressGlobal = -0.001;
    this._scopeGlobal = [0, 0];
    this._scopeIn = [0, 0];
    this._scopeMove = [0, 0];
    this._scopeOut = [0, 0];
    this._frameThrottleIndex = 0;

    // Initialize the component
    if (canInit) {
      this.init();
    }
  }

  /**
   * Initializes the `SectionScrollProgress` component and sets up scroll and resize events.
   */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /**
   * Sets the resize and scroll events for monitoring the section's scroll progress.
   */
  protected _setEvents() {
    const { viewportTarget, resizeDebounce } = this.props;

    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: this.section,
      viewportTarget,
      hasBothEvents: true,
      resizeDebounce,
    });

    const loadEvent = getApp().onPageLoad();
    loadEvent.then(() => resizeHandler.debounceResize()).catch(() => {});

    // Set up scroll event
    const scrollEvent = onScroll({
      container: this.scrollContainer,
      callback: (data) => this._render(data),
    });

    // Clean up actions on destroy
    this.addDestroyableAction(() => {
      resizeHandler.remove();
      loadEvent.cancel();
      scrollEvent.remove();
    });
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this.resize();
  }

  /**
   * Returns the progress of the section as it appears in the viewport.
   */
  get progressIn() {
    return clampScope(this.progressGlobal, this.scopeIn) || 0;
  }

  /**
   * Returns the progress of the section as it exits the viewport.
   */
  get progressOut() {
    return clampScope(this.progressGlobal, this.scopeOut) || 0;
  }

  /**
   * Returns the progress of the section as it moves through the viewport.
   */
  get progressMove() {
    return clampScope(this.progressGlobal, this.scopeMove) || 0;
  }

  /**
   * Resizes the section and recalculates the scroll progress.
   */
  public resize() {
    const scrollValues = getScrollValues(this.scrollContainer);
    if (!scrollValues) {
      return;
    }

    // Trigger resize callback
    this.callbacks.tbt('resize', undefined);

    // Render the section
    this._render(scrollValues, true);
  }

  /**
   * Calculates the scroll scopes for the section.
   */
  protected _calculateScopes({ scrollTop }: IGetScrollValues) {
    const { height: vHeight } = getApp().viewport;
    const sectionBounding = this.section.getBoundingClientRect();

    // Calculate scroll scopes
    const inStart = scrollTop + sectionBounding.top - vHeight;
    const moveEnd = scrollTop + sectionBounding.top + sectionBounding.height;
    const scrollLine = moveEnd - inStart;
    this._scopeGlobal = [inStart, moveEnd];

    // Calculate individual scopes
    this._scopeIn = [0, vHeight / scrollLine];
    this._scopeOut = [1 - vHeight / scrollLine, 1];
    this._scopeMove = [this._scopeIn[1], this._scopeOut[0]];
  }

  /**
   * Determines whether the section can be rendered based on scroll progress changes.
   */
  protected _canRender(isForce = false) {
    return isForce || this.progressGlobal !== this._prevProgressGlobal;
  }

  /**
   * Renders the section by updating its scroll progress and triggering callbacks.
   */
  protected _render(scrollValues: IGetScrollValues, isForce = false) {
    this._frameThrottleIndex += 1;

    if (this._frameThrottleIndex % 60 === 0 || isForce) {
      this._calculateScopes(scrollValues);
    }

    this._prevProgressGlobal = this.progressGlobal;
    this.progressGlobal = clampScope(scrollValues.scrollTop, this._scopeGlobal);

    if (!this._canRender(isForce)) {
      return;
    }

    // Trigger render callback
    this.callbacks.tbt('render', undefined);
  }
}
