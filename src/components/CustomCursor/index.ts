import { addEventListener, createElement, selectOne } from 'vevet-dom';
import { AnimationFrame } from '../AnimationFrame';
import { NCustomCursor } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { lerp } from '@/utils/math';
import { getApp } from '@/utils/internal/getApp';

export type { NCustomCursor };

/**
 * Creates a smooth custom cursor
 */
export class CustomCursor<
  StaticProps extends NCustomCursor.IStaticProps = NCustomCursor.IStaticProps,
  ChangeableProps extends
    NCustomCursor.IChangeableProps = NCustomCursor.IChangeableProps,
  CallbacksTypes extends
    NCustomCursor.ICallbacksTypes = NCustomCursor.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: window,
      isEnabled: true,
      isNativeCursorHidden: false,
      width: 36,
      height: 36,
      lerp: 0.2,
      isFpsNormalized: true,
      shouldAutoStop: true,
    };
  }

  get prefix() {
    return `${getApp().prefix}custom-cursor`;
  }

  /** Cursor container */
  get container() {
    return this._container;
  }

  /** Cursor container */
  protected _container: Element | Window;

  /** The container is window */
  protected _isContainerWindow: boolean;

  /** DOM parent for the cursor element */
  get domContainer(): HTMLElement {
    if (this.container instanceof Window) {
      return getApp().body;
    }

    return this.container as HTMLElement;
  }

  /** Cursor element (outer element) */
  get outerElement() {
    return this._outerElement;
  }

  /** Outer cursor element */
  protected _outerElement!: HTMLElement;

  /** Cursor element (inner element) */
  get innerElement() {
    return this._innerElement;
  }

  /** Inner cursor element */
  protected _innerElement!: HTMLElement;

  /** Hovered element */
  protected _hoveredElement?: NCustomCursor.IHoveredElement | undefined;

  /** Hovered element */
  get hoveredElement(): NCustomCursor.IHoveredElement | undefined {
    return this._hoveredElement;
  }

  /** Hovered element */
  set hoveredElement(value: NCustomCursor.IHoveredElement | undefined) {
    this._hoveredElement = value;
  }

  /** Animation frame */
  protected _animationFrame!: AnimationFrame;

  /** Current cursor coordinates */
  protected _coords: NCustomCursor.ICoords;

  /** Current cursor coordinates */
  get coords() {
    return this._coords;
  }

  /** Target cursor coordinates */
  protected _targetCoords: NCustomCursor.ICoords;

  /** Target cursor coordinates */
  get targetCoords() {
    const { hoveredElement, props } = this;

    let { x, y } = this._targetCoords;
    let { width, height } = props;
    let padding = 0;

    if (hoveredElement) {
      const bounding = hoveredElement.element.getBoundingClientRect();

      if (hoveredElement.isSticky) {
        x = bounding.left + bounding.width / 2;
        y = bounding.top + bounding.height / 2;
      }

      if (hoveredElement.width === 'auto') {
        width = bounding.width;
      } else if (typeof hoveredElement.width === 'number') {
        width = hoveredElement.width;
      }

      if (hoveredElement.height === 'auto') {
        height = bounding.height;
      } else if (typeof hoveredElement.height === 'number') {
        height = hoveredElement.height;
      }

      padding = hoveredElement.padding ?? 0;
    }

    width += padding * 2;
    height += padding * 2;

    return { x, y, width, height };
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // get cursor container
    const container = selectOne(this.props.container);
    if (container) {
      this._container = container;
    } else {
      throw new Error(`No cursor container for ${this.props.container}`);
    }
    this._isContainerWindow = container instanceof Window;

    // set default vars
    const { width, height } = this.props;
    this._coords = { x: 0, y: 0, width, height };
    this._targetCoords = { x: 0, y: 0, width, height };

    if (canInit) {
      this.init();
    }
  }

  /** Init the class */
  protected _init() {
    super._init();

    // create
    this._createCursor();
    this._setEvents();

    // enable by default
    if (this.props.isEnabled) {
      this._enable();
    }
  }

  /** Handle properties mutation */
  protected _onPropsMutate() {
    super._onPropsMutate();

    if (this.props.isEnabled) {
      this._enable();
    } else {
      this._disable();
    }
  }

  /** Create custom cursor */
  protected _createCursor() {
    const { container, domContainer } = this;

    // hide native cursor
    if (this.props.isNativeCursorHidden) {
      domContainer.style.cursor = 'none';
      domContainer.classList.add(this.className('-hide-defaut-cursor'));
    }

    // set classnames
    domContainer.classList.add(this.className('-container'));

    // create outer element
    this._outerElement = createElement('div', {
      class: this.className(
        '',
        container instanceof Window ? '-in-window' : '-in-element',
        '-disabled',
      ),
      parent: domContainer,
    });

    // create inner element
    this._innerElement = createElement('div', {
      class: this.className('__inner', '-disabled'),
      parent: this._outerElement,
    });

    // launch events
    this.callbacks.tbt('create', {
      outerElement: this.outerElement,
      innerElement: this.innerElement,
    });

    this.addDestroyableAction(() => {
      domContainer.style.cursor = '';
      domContainer.classList.remove(this.className('-hide-defaut-cursor'));
      domContainer.classList.remove(this.className('-container'));

      this._outerElement.remove();
      this._innerElement.remove();
    });
  }

  /** Set module events */
  protected _setEvents() {
    const { domContainer } = this;

    this._animationFrame = new AnimationFrame();
    this._animationFrame.addCallback('frame', () => this.render());
    this.addDestroyableAction(() => this._animationFrame.destroy());

    this.addEventListener(
      domContainer,
      'mouseenter',
      this._handleMouseEnter.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mouseleave',
      this._handleMouseLeave.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mousemove',
      this._handleMouseMove.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mousedown',
      this._handleMouseDown.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mouseup',
      this._handleMouseUp.bind(this),
    );

    this.addEventListener(window, 'blur', this._handleWindowBlur.bind(this));
  }

  /** Event on mouse enter */
  protected _handleMouseEnter(evt: MouseEvent) {
    this._coords.x = evt.clientX;
    this._coords.y = evt.clientY;
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    this.outerElement.classList.add(this.className('-in-action'));
  }

  /** Event on mouse leave */
  protected _handleMouseLeave() {
    this.outerElement.classList.remove(this.className('-in-action'));
  }

  /** Event on mouse move */
  protected _handleMouseMove(evt: MouseEvent) {
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    this.outerElement.classList.add(this.className('-in-action'));

    if (this.props.isEnabled) {
      this._animationFrame.play();
    }
  }

  /** Event on mouse down */
  protected _handleMouseDown(evt: MouseEvent) {
    if (evt.which === 1) {
      this.outerElement.classList.add(this.className('-click'));
      this.innerElement.classList.add(this.className('-click'));
    }
  }

  /** Event on mouse up */
  protected _handleMouseUp() {
    this.outerElement.classList.remove(this.className('-click'));
    this.innerElement.classList.remove(this.className('-click'));
  }

  /** Event on window blur */
  protected _handleWindowBlur() {
    this._handleMouseUp();
  }

  /** Set hover events on an element */
  public addHoverElement(
    settingsProp: NCustomCursor.IHoveredElement,
    enterTimeout = 100,
  ) {
    const settings: NCustomCursor.IHoveredElement = {
      width: 'auto',
      height: 'auto',
      ...settingsProp,
    };
    const { element } = settings;

    let timeout: NodeJS.Timeout | undefined;

    const mouseEnter = addEventListener(element, 'mouseenter', () => {
      timeout = setTimeout(() => {
        this.hoveredElement = { ...settings };
      }, enterTimeout);
    });

    const mouseLeave = addEventListener(element, 'mouseleave', () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      this.hoveredElement = undefined;
    });

    const remove = () => {
      if (this.hoveredElement?.element === element) {
        this.hoveredElement = undefined;
      }

      mouseEnter.remove();
      mouseLeave.remove();

      if (timeout) {
        clearTimeout(timeout);
      }
    };

    this.addDestroyableAction(() => remove());

    return { remove };
  }

  /**
   * If all coordinates are interpolated
   */
  public get isCoordsInterpolated() {
    const { coords, targetCoords } = this;

    return (
      coords.x === targetCoords.x &&
      coords.y === targetCoords.y &&
      coords.width === targetCoords.width &&
      coords.height === targetCoords.height
    );
  }

  /** Render the scene */
  public render() {
    const { props } = this;

    this._calculateCoords();
    const realCoords = this._renderElements();

    if (props.shouldAutoStop && this.isCoordsInterpolated) {
      this._animationFrame.pause();
    }

    // launch render events
    this.callbacks.tbt('render', realCoords);
  }

  /** Recalculate current coordinates */
  protected _calculateCoords() {
    const { targetCoords, _coords: coords } = this;

    coords.x = this._lerp(coords.x, targetCoords.x);
    coords.y = this._lerp(coords.y, targetCoords.y);
    coords.width = this._lerp(coords.width, targetCoords.width);
    coords.height = this._lerp(coords.height, targetCoords.height);
  }

  /** Linear interpolation */
  protected _lerp(current: number, target: number) {
    const { isFpsNormalized, lerp: ease } = this.props;

    const fpsMultiplier = isFpsNormalized
      ? this._animationFrame.easeMultiplier
      : 1;

    const value = lerp(current, target, ease * fpsMultiplier, 0.02);

    return value;
  }

  /** Render elements */
  protected _renderElements(): NCustomCursor.ICoords {
    const { domContainer, outerElement } = this;
    let { x, y } = this.coords;
    const { width, height } = this.coords;

    if (!this._isContainerWindow) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    // update dom coordinates
    outerElement.style.transform = `translate(${x}px, ${y}px)`;
    outerElement.style.setProperty('--cursor-w', `${width}px`);
    outerElement.style.setProperty('--cursor-h', `${height}px`);

    return { x, y, width, height };
  }

  /** Enable cursor animation */
  protected _enable() {
    this.outerElement.classList.remove(this.className('-disabled'));
    this.innerElement.classList.remove(this.className('-disabled'));

    this._animationFrame.play();
  }

  /** Disable cursor animation */
  protected _disable() {
    this.outerElement.classList.add(this.className('-disabled'));
    this.innerElement.classList.add(this.className('-disabled'));

    this._animationFrame.pause();
  }
}
