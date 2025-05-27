import { TRequiredProps } from '@/internal/requiredProps';
import { loop } from '@/utils/math';
import { onResize, addEventListener } from '@/utils/listeners';
import {
  IMarqueeCallbacksMap,
  IMarqueeMutableProps,
  IMarqueeStaticProps,
} from './types';
import { Module } from '@/base/Module';
import { Raf } from '../Raf';
import { initVevet } from '@/global/initVevet';
import { toPixels } from '@/utils';

export * from './types';

/**
 * A custom marquee component that smoothly scrolls its child elements.
 *
 * This component is designed to loop elements horizontally within a container,
 * with support for customization such as speed, gap, pause on hover, and more.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Marquee)
 *
 * @group Components
 */
export class Marquee<
  CallbacksMap extends IMarqueeCallbacksMap = IMarqueeCallbacksMap,
  StaticProps extends IMarqueeStaticProps = IMarqueeStaticProps,
  MutableProps extends IMarqueeMutableProps = IMarqueeMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      resizeDebounce: 0,
      hasWillChange: true,
      cloneNodes: true,
    } as TRequiredProps<StaticProps>;
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      speed: 1,
      gap: 0,
      enabled: true,
      pauseOnHover: false,
      centered: false,
      adjustSpeed: true,
      pauseOnOut: true,
    } as TRequiredProps<MutableProps>;
  }

  /** Current container width */
  protected _width = 0;

  /** Initial child nodes of the container */
  protected _initialNodes: ChildNode[] = [];

  /** Array of marquee element nodes */
  protected _elements: HTMLElement[] = [];

  /** Array of widths of each child element */
  protected _widths: number[] = [];

  /** Total width of all elements in the marquee */
  protected _totalWidth = 0;

  /** Total width of all elements in the marquee */
  get totalWidth() {
    return this._totalWidth;
  }

  /** Last setup handler for teardown */
  protected _lastSetup?: () => void;

  /** The current X coordinate of the marquee. */
  protected _x = 0;

  /** The current X coordinate of the marquee. */
  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this.render(0);
  }

  /** Raf instance */
  protected _raf: Raf;

  /** Intersection observer */
  protected _intersection?: IntersectionObserver;

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    const { container } = this.props;

    if (!container) {
      throw new Error('Marquee container is not defined');
    }

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
    this._raf = new Raf({ enabled: this.props.enabled, fpsRecalcFrames: 1 });
    this._raf.on('frame', () => {
      const factor = this.props.adjustSpeed ? this._raf.fpsFactor : 1;
      const speed = toPixels(this.props.speed);
      this._render(speed * factor);
    });

    // Pause on hover
    const mouseenter = addEventListener(container, 'mouseenter', () => {
      if (this.props.pauseOnHover) {
        this._raf.pause();
      }
    });
    this.onDestroy(() => mouseenter());

    // Resume on mouse leave
    const mouseleave = addEventListener(container, 'mouseleave', () => {
      if (this.props.enabled) {
        this._raf.play();
      }
    });
    this.onDestroy(() => mouseleave());

    // Intersection observer
    this._intersection = new IntersectionObserver(
      this._handleIntersection.bind(this),
      { root: null },
    );
    this._intersection.observe(container);
  }

  /** Handles property changes  */
  protected _handleProps() {
    super._handleProps();

    if (this.props.enabled) {
      this._raf.play();
    } else {
      this._raf.pause();
    }

    // Rerender the elements
    this.resize();
    this.render(0);
  }

  /** Initializes the marquee setup, including resizing and cloning elements */
  protected _setup() {
    this._lastSetup?.();

    if (this.isDestroyed) {
      return;
    }

    const { container, resizeDebounce } = this.props;

    // Save initial child nodes
    this._initialNodes = [...Array.from(container.childNodes)];

    // Wrap text node if necessary
    this._wrapTextNode();

    // Store element references
    this._elements = Array.from(container.children) as any;

    // Add necessary styles to elements
    this._elements.forEach((element, index) =>
      this._applyNodeStyles(element, index !== 0),
    );

    // initial resize
    this.resize();

    // Resize on page load
    const onPageLoad = initVevet().onLoad(() => this.resize());

    // Handle resizing
    const resizeHandler = onResize({
      callback: () => this.resize(),
      element: [container, ...this._elements],
      viewportTarget: 'width',
      resizeDebounce,
      name: this.name,
    });

    // Setup cleanup function
    this._lastSetup = () => {
      onPageLoad();
      resizeHandler.remove();
    };
  }

  /**
   * Wraps the first text node in the container in a span if no other elements exist.
   */
  protected _wrapTextNode() {
    const { container } = this.props;

    const hasOneNode = container.childNodes.length === 1;
    const node = container.childNodes[0];

    // Wrap text node if it's the first child and not already wrapped
    if (!node || node.nodeType !== 3 || !hasOneNode) {
      return;
    }

    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'block';
    wrapper.style.width = 'max-content';
    wrapper.style.whiteSpace = 'nowrap';

    wrapper.appendChild(node);
    container.appendChild(wrapper);
  }

  /**
   * Adds necessary styles to a given element.
   */
  protected _applyNodeStyles(element: HTMLElement, isAbsolute: boolean) {
    const el = element;

    el.style.position = isAbsolute ? 'absolute' : 'relative';
    el.style.top = isAbsolute ? '50%' : '0';
    el.style.left = '0';
    el.style.width = element.style.width || 'max-content';
    el.style.willChange = this.props.hasWillChange ? 'transform' : '';
    el.style.flexShrink = '0';
  }

  /** Resizes the marquee, recalculating element positions and cloning if necessary. */
  public resize() {
    if (this.isDestroyed) {
      return;
    }

    const { props } = this;
    const { container } = props;
    const gap = toPixels(props.gap);

    // Update container width
    this._width = container.offsetWidth;

    // Update element widths
    this._widths = this._elements.map((element) => element.offsetWidth + gap);
    this._totalWidth = this._widths.reduce((a, b) => a + b, 0);

    // Determine how many times to duplicate elements
    const maxWidth = Math.max(...this._widths);
    const copyQuantity = Math.ceil((this._width + maxWidth) / this._totalWidth);

    // update total width
    this._totalWidth = Math.max(this._totalWidth, this._width + maxWidth);

    // Clone elements if necessary
    if (props.cloneNodes && copyQuantity > 1) {
      for (let i = 1; i < copyQuantity; i += 1) {
        this._elements.forEach((element) => {
          const copy = element.cloneNode(true) as HTMLElement;
          this._applyNodeStyles(copy, true);
          container.appendChild(copy);
        });
      }

      // Update element references after cloning
      this._elements = Array.from(container.children) as any;
      this.resize();
    }

    // Trigger resize callbacks
    this.callbacks.emit('resize', undefined);

    // Rerender the marquee
    setTimeout(() => this.render(0), 0);
  }

  /** Renders the marquee, adjusting element positions. */
  public render(step?: number) {
    this._render(step);
  }

  /**
   * Renders the marquee, calculating element positions based on the provided speed.
   */
  protected _render(step = this.props.speed) {
    if (this.isDestroyed) {
      return;
    }

    // Update animation time
    this._x -= toPixels(step);

    // Calculate current position of the elements
    const centerX = this._width * 0.5;
    const position = this._x + (this.props.centered ? centerX : 0);

    // Update each element's position
    let prevStaticX = 0;
    for (let index = 0; index < this._elements.length; index += 1) {
      const element = this._elements[index];
      const elementWidth = this._widths[index];

      const x = loop(
        position + prevStaticX,
        -elementWidth,
        this._totalWidth - elementWidth,
      );

      // Apply transformations to position the element
      const y = element.style.position === 'relative' ? '0' : '-50%';
      element.style.transform = `translate(${x}px, ${y})`;

      prevStaticX += elementWidth;
    }

    // Trigger render callbacks
    this.callbacks.emit('render', undefined);
  }

  /**
   * Handle intersection observer
   */
  protected _handleIntersection(entries: IntersectionObserverEntry[]) {
    if (!this.props.pauseOnOut) {
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting && this.props.enabled) {
        this._raf.play();
      } else {
        this._raf.pause();
      }
    });
  }

  /** Destroys the instance and cleans up resources */
  protected _destroy() {
    const { container } = this.props;

    super._destroy();

    this._raf.destroy();
    this._intersection?.disconnect();

    this._lastSetup?.();

    // Remove all children and restore the initial nodes
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this._initialNodes.forEach((node) => container.appendChild(node));
  }
}
