import { selectOne } from 'vevet-dom';
import { NMarquee } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { AnimationFrame } from '../AnimationFrame';
import { getApp } from '@/utils/internal/getApp';
import { wrap } from '@/utils/math';
import { onResize } from '@/utils/listeners';

export type { NMarquee };

/**
 * A custom marquee component that smoothly scrolls its child elements.
 *
 * This component is designed to loop elements horizontally within a container,
 * with support for customization such as speed, gap, pause on hover, and more.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/marquee/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/Marquee.html
 */
export class Marquee<
  StaticProps extends NMarquee.IStaticProps = NMarquee.IStaticProps,
  ChangeableProps extends NMarquee.IChangeableProps = NMarquee.IChangeableProps,
  CallbacksTypes extends NMarquee.ICallbacksTypes = NMarquee.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  /**
   * Returns the default properties for the marquee.
   */
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      resizeDebounce: 0,
      hasWillChange: true,
      canCloneNodes: true,
      speed: 1,
      gap: 0,
      isEnabled: true,
      pauseOnHover: false,
      isFpsNormalized: true,
      isCentered: false,
    };
  }

  /**
   * Returns the prefix for the marquee.
   */
  get prefix() {
    return `${getApp().prefix}marquee`;
  }

  /** Marquee container element */
  protected _container: HTMLElement;

  /** Marquee container element */
  get container() {
    return this._container;
  }

  /** Current container width */
  private _width = 0;

  /** Initial child nodes of the container */
  private _initialNodes: ChildNode[] = [];

  /** Array of marquee element nodes */
  private _elements: HTMLElement[] = [];

  /** Timeout for resize debounce */
  private _resizeTimeout: NodeJS.Timeout | null = null;

  /** Array of widths of each element in the marquee */
  private _widths: number[] = [];

  /** Total width of all elements in the marquee */
  private _totalWidth = 0;

  /** Total width of all elements in the marquee */
  get totalWidth() {
    return this._totalWidth;
  }

  /** Last setup handler for teardown */
  private _lastSetup?: () => void;

  /** Current animation X position */
  protected _x: number;

  /** Current animation X position */
  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this.render(0);
  }

  /** Whether the marquee can play (used for pausing) */
  protected _canPlay: boolean;

  /** Animation frame instance */
  protected _raf: AnimationFrame;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._container = selectOne(this.props.container)! as HTMLElement;
    const container = this._container;
    if (!(container instanceof HTMLElement)) {
      throw new Error('No container');
    }

    this.toggleClassName(container, this.className(''), true);

    // Initialize internal variables
    this._x = 0;
    this._canPlay = true;

    // Apply base styles to the container
    container.style.position = 'relative';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'flex-start';
    container.style.width = '100%';
    container.style.overflow = 'hidden';

    // Setup elements in the marquee
    this._setup();

    // Create animation frame
    this._raf = new AnimationFrame({
      isEnabled: this.props.isEnabled,
    });
    this._raf.addCallback('frame', () => this._render());

    // Initialize the component if canInit is true
    if (canInit) {
      this.init();
    }
  }

  /** Initializes the component and sets up event listeners */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /** Sets up event listeners for the marquee component */
  protected _setEvents() {
    const { container, props } = this;

    // Pause on hover
    this.addEventListener(container, 'mouseenter', () => {
      if (props.pauseOnHover) {
        this._canPlay = false;
      }
    });

    // Resume on mouse leave
    this.addEventListener(container, 'mouseleave', () => {
      this._canPlay = true;
    });
  }

  /** Handles property changes and re-renders the component */
  protected _onPropsMutate() {
    super._onPropsMutate();

    if (this.props.isEnabled) {
      this._raf?.play();
    } else {
      this._raf?.pause();
    }

    // Rerender the elements
    this.render(0);
  }

  /** Initializes the marquee setup, including resizing and cloning elements */
  protected _setup() {
    this._lastSetup?.();

    if (this.isDestroyed) {
      return;
    }

    const container = this._container;

    // Save initial child nodes
    this._initialNodes = [...Array.from(container.childNodes)];

    // Wrap text node if necessary
    this._wrapTextNode();

    // Store element references
    this._elements = Array.from(container.querySelectorAll('*'));

    // Handle container resizing
    const onContainerResize = onResize({
      onResize: () => this._handleResize(),
      element: container,
      viewportTarget: 'width',
      hasBothEvents: false,
    });

    // Resize on page load
    getApp()
      .onPageLoad()
      .then(() => this._handleResize())
      .catch(() => {});

    // Set resize events for individual elements
    const elementsResize = onResize({
      onResize: () => this._handleResize(),
      element: this._elements,
      viewportTarget: 'width',
      hasBothEvents: false,
    });

    // Add necessary styles to elements
    this._elements.forEach((element, index) =>
      this._addElementStyles(element, index !== 0),
    );

    // Setup cleanup function
    this._lastSetup = () => {
      onContainerResize.remove();
      elementsResize.remove();
    };
  }

  /**
   * Wraps the first text node in the container in a span if no other elements exist.
   */
  private _wrapTextNode() {
    const node = this._container.childNodes[0];

    // Wrap text node if it's the first child and not already wrapped
    if (!node || node.nodeType !== 3) {
      return;
    }

    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'block';
    wrapper.style.width = 'max-content';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.appendChild(node);
    this._container.appendChild(wrapper);
  }

  /**
   * Adds necessary styles to a given element.
   */
  private _addElementStyles(element: HTMLElement, isAbsolute: boolean) {
    const el = element;

    el.style.position = isAbsolute ? 'absolute' : 'relative';
    el.style.top = isAbsolute ? '50%' : '0';
    el.style.left = '0';
    el.style.width = element.style.width || 'max-content';
    el.style.willChange = this.props.hasWillChange ? 'transform' : '';
  }

  /** Handles resize events and updates the layout accordingly */
  private _handleResize() {
    if (this.isDestroyed) {
      return;
    }

    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }

    this._resizeTimeout = setTimeout(
      () => this.resize(),
      this.props.resizeDebounce,
    );
  }

  /** Resizes the marquee, recalculating element positions and cloning if necessary */
  public resize() {
    if (this.isDestroyed) {
      return;
    }

    const { container, props } = this;

    // Update container width
    this._width = container.offsetWidth;

    // Update element widths
    this._widths = [];
    this._elements.forEach((element, index) => {
      this._widths[index] = element.offsetWidth + props.gap;
    });
    this._totalWidth = this._widths.reduce((a, b) => a + b, 0);

    // Determine how many times to duplicate elements
    const maxWidth = Math.max(...this._widths);
    const copyQuantity = Math.ceil((this._width + maxWidth) / this._totalWidth);

    // update total width
    this._totalWidth = Math.max(this._totalWidth, this._width + maxWidth);

    // Clone elements if necessary
    if (props.canCloneNodes && copyQuantity > 1) {
      for (let i = 1; i < copyQuantity; i += 1) {
        this._elements.forEach((element) => {
          const copy = element.cloneNode(true) as HTMLElement;
          this._addElementStyles(copy, true);
          container.appendChild(copy);
        });
      }

      // Update element references after cloning
      this._elements = Array.from(container.querySelectorAll('*'));
      this.resize();
    }

    // Trigger resize callbacks
    this.callbacks.tbt('resize', undefined);

    // Rerender the marquee
    this.render(0);
  }

  /** Renders the marquee, adjusting element positions */
  public render(speed?: number) {
    this._render(speed);
  }

  /**
   * Renders the marquee, calculating element positions based on the provided speed.
   */
  protected _render(speedProp = this.props.speed) {
    if (!this._canPlay || this.isDestroyed) {
      return;
    }

    const { isFpsNormalized, isCentered } = this.props;

    // Calculate speed, adjusting for frame rate if necessary
    const fpsMultiplier = isFpsNormalized ? this._raf.fpsMultiplier : 1;
    const speed = speedProp * fpsMultiplier;

    // Update animation time
    this._x -= speed;

    // Calculate current position of the elements
    const centerX = this._width * 0.5;
    const position = this._x + (isCentered ? centerX : 0);

    // Update each element's position
    let prevStaticX = 0;
    for (let index = 0; index < this._elements.length; index += 1) {
      const element = this._elements[index];
      const elementWidth = this._widths[index];

      const x = wrap(
        -elementWidth,
        this._totalWidth - elementWidth,
        position + prevStaticX,
      );

      // Apply transformations to position the element
      const y = element.style.position === 'relative' ? '0' : '-50%';
      element.style.transform = `translate(${x}px, ${y})`;

      prevStaticX += elementWidth;
    }

    // Trigger render callbacks
    this.callbacks.tbt('render', undefined);
  }

  /** Destroys the marquee and removes all event listeners */
  protected _destroy() {
    super._destroy();

    this._raf?.destroy();
    this._lastSetup?.();

    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
    }

    // Remove all children and restore the initial nodes
    while (this._container.firstChild) {
      this._container.removeChild(this._container.firstChild);
    }

    this._initialNodes.forEach((node) => this._container.appendChild(node));
  }
}
