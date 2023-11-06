import { selectOne } from 'vevet-dom';
import type { SmoothScroll } from '../SmoothScroll';
import { NScrollSectionProgress } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { clampScope } from '@/utils/math';
import { IGetScrollValues, getScrollValues, onScroll } from '@/utils/scroll';
import { onResize } from '@/utils/listeners/onResize';

export type { NScrollSectionProgress };

/**
 * Trace scroll progress of a section
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
      container: window,
      viewportTarget: 'any',
      resizeTimeout: 0,
    };
  }

  /** Scroll container */
  protected _scrollContainer: Element | SmoothScroll | Window;

  /** Scroll container */
  get scrollContainer() {
    return this._scrollContainer;
  }

  /** Section element */
  protected _section: Element;

  /** Section element */
  get section() {
    return this._section;
  }

  /** Scrolling scope */
  protected _scopeGlobal: [number, number];

  /** Scrolling scope */
  get scopeGlobal() {
    return this._scopeGlobal;
  }

  /** Scope of element appearing from bottom to top */
  protected _scopeIn: [number, number];

  /** Scope of element appearing from bottom to top */
  get scopeIn() {
    return this._scopeIn;
  }

  /** Scope of element moving */
  protected _scopeMove: [number, number];

  /** Scope of element moving */
  get scopeMove() {
    return this._scopeMove;
  }

  /** Scope of element disappearing from bottom to top */
  protected _scopeOut: [number, number];

  /** Scope of element disappearing from bottom to top */
  get scopeOut() {
    return this._scopeOut;
  }

  /** Previous global progress */
  protected _prevProgressGlobal: number;

  /** Global progress */
  protected _progressGlobal: number;

  /** Global progress */
  get progressGlobal() {
    return this._progressGlobal;
  }

  protected set progressGlobal(value) {
    this._progressGlobal = value;
  }

  protected _frameThrottleIndex: number;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container, section } = this.props;

    // get scroll container
    if (typeof container === 'string') {
      this._scrollContainer = selectOne(container) as Element;
    } else {
      this._scrollContainer = container as any;
    }

    // get section element
    this._section = selectOne(section) as Element;

    // set defaults
    this._prevProgressGlobal = -0.001;
    this._progressGlobal = -0.001;
    this._scopeGlobal = [0, 0];
    this._scopeIn = [0, 0];
    this._scopeMove = [0, 0];
    this._scopeOut = [0, 0];
    this._frameThrottleIndex = 0;

    // initialize the class
    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  /** Set events */
  protected _setEvents() {
    const { viewportTarget, resizeDebounce } = this.props;

    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: this.section,
      viewportTarget,
      hasBothEvents: true,
      resizeDebounce,
    });

    const loadEvent = this.app.onPageLoad();
    loadEvent.then(() => resizeHandler.debounceResize()).catch(() => {});

    // set scroll events
    const scrollEvent = onScroll({
      container: this.scrollContainer,
      callback: (data) => this._render(data),
    });

    // destroy events
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

  /** 'in' progress */
  get progressIn() {
    return clampScope(this.progressGlobal, this.scopeIn) || 0;
  }

  /** 'out' progress */
  get progressOut() {
    return clampScope(this.progressGlobal, this.scopeOut) || 0;
  }

  /** 'move' progress */
  get progressMove() {
    return clampScope(this.progressGlobal, this.scopeMove) || 0;
  }

  /** Resize the scene */
  public resize() {
    const scrollValues = getScrollValues(this.scrollContainer);
    if (!scrollValues) {
      return;
    }

    // launch callbacks
    this.callbacks.tbt('resize', undefined);

    // render the scene
    this._render(scrollValues, true);
  }

  /** Calculate scopes */
  protected _calculateScopes({ scrollTop }: IGetScrollValues) {
    const { height: vHeight } = this.app.viewport;
    const sectionBounding = this.section.getBoundingClientRect();

    // calculate scroll scope
    const inStart = scrollTop + sectionBounding.top - vHeight;
    const moveEnd = scrollTop + sectionBounding.top + sectionBounding.height;
    const scrollLine = moveEnd - inStart;
    this._scopeGlobal = [inStart, moveEnd];

    // calculate other scopes
    this._scopeIn = [0, vHeight / scrollLine];
    this._scopeOut = [1 - vHeight / scrollLine, 1];
    this._scopeMove = [this._scopeIn[1], this._scopeOut[0]];
  }

  /** Check if the section can be rendered */
  protected _canRender(isForce = false) {
    return isForce || this.progressGlobal !== this._prevProgressGlobal;
  }

  /** Render the scene */
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

    this.callbacks.tbt('render', undefined);
  }
}
