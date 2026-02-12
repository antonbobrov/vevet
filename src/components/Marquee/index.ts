import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { getTextDirection } from '@/internal/textDirection';
import { toPixels } from '@/utils';
import { onResize, addEventListener } from '@/utils/listeners';
import { loop } from '@/utils/math';

import { Raf } from '../Raf';

import { MarqueeNodes } from './Nodes';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  appleMarqueeContainerStyles,
  removeMarqueeContainerStyles,
} from './styles';
import {
  IMarqueeCallbacksMap,
  IMarqueeMutableProps,
  IMarqueeStaticProps,
} from './types';

export * from './types';

type TC = IMarqueeCallbacksMap;
type TS = IMarqueeStaticProps;
type TM = IMarqueeMutableProps;

/**
 * A custom marquee component that smoothly scrolls its child elements.
 *
 * This component is designed to loop elements horizontally within a container,
 * with support for customization such as speed, gap, pause on hover, and more.
 *
 * [Documentation](https://vevetjs.com/docs/Marquee)
 *
 * @group Components
 */
export class Marquee extends Module<TC, TS, TM> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Current container size (width or height depending on direction) */
  private _containerSize = 0;

  /** Array of sizes of each child element */
  private _sizes: number[] = [];

  /** Total size of all elements in the marquee */
  private _totalSize = 0;

  /** Last setup handler for teardown */
  private _lastSetup?: () => void;

  /** The current marquee coordinate. */
  private _coord = 0;

  /** Raf instance */
  private _raf: Raf;

  /** Detects if the container is RTL */
  private _isRtl = false;

  /** Nodes manager */
  private _nodes: MarqueeNodes;

  constructor(
    props?: TS & TM,
    onCallbacks?: TModuleOnCallbacksProps<TC, Marquee>,
  ) {
    super(props, onCallbacks as any);

    const { container, direction } = this.props;
    const { isVertical } = this;

    if (!container) {
      throw new Error('Marquee container is not defined');
    }

    // Update direction
    const isRtl =
      getTextDirection(container) === 'rtl' && direction === 'horizontal';
    this._isRtl = isRtl;

    // Apply base styles to the container
    appleMarqueeContainerStyles({ container, isVertical, isRtl });

    // Create nodes manager
    this._nodes = new MarqueeNodes(this);

    // Setup elements in the marquee
    this._setup();

    // Create animation frame
    this._raf = new Raf({ enabled: this.props.enabled, fpsRecalcFrames: 1 });

    // Set events
    this._setEvents();
  }

  /** Total size of all elements in the marquee (width or height depending on direction) */
  get totalSize() {
    return this._totalSize;
  }

  /**
   * Total width of all elements in the marquee
   * @deprecated Use `totalSize` instead
   */
  get totalWidth() {
    return this.totalSize;
  }

  /** The current marquee coordinate. */
  get coord() {
    return this._coord;
  }

  set coord(value) {
    this._coord = value;
    this.render(0);
  }

  /**
   * The current coordinate of the marquee.
   * @deprecated Use `coord` instead
   */
  get x() {
    return this.coord;
  }

  set x(value) {
    this.coord = value;
  }

  /** Check if the marquee is vertical */
  get isVertical() {
    return this.props.direction === 'vertical';
  }

  /** Marquee gap */
  private get gap() {
    return Math.max(toPixels(this.props.gap), 0);
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

  /** Set marquee events */
  protected _setEvents() {
    const { props } = this;
    const { container } = props;

    this._raf.on('frame', () => {
      const factor = props.adjustSpeed ? this._raf.fpsFactor : 1;
      const speed = toPixels(props.speed);

      this._render(speed * factor);
    });

    // Pause on hover
    const mouseenter = addEventListener(container, 'mouseenter', () => {
      if (this.props.pauseOnHover) {
        this._raf.pause();
      }
    });

    // Resume on mouse leave
    const mouseleave = addEventListener(container, 'mouseleave', () => {
      if (this.props.enabled) {
        this._raf.play();
      }
    });

    // Intersection observer
    const intersection = new IntersectionObserver(
      this._handleIntersection.bind(this),
      { root: null },
    );
    intersection.observe(container);

    this.onDestroy(() => {
      mouseenter();
      mouseleave();

      intersection.disconnect();
    });
  }

  /** Initializes the marquee setup, including resizing and cloning elements */
  private _setup() {
    this._lastSetup?.();

    if (this.isDestroyed) {
      return;
    }

    const { container, resizeDebounce } = this.props;

    // Process nodes
    this._nodes.save();
    this._nodes.wrap();
    this._nodes.applyStyles();

    // initial resize
    this.resize();

    // Resize on page load
    const onPageLoad = initVevet().onLoad(() => this.resize());

    // Handle resizing
    const resizeHandler = onResize({
      callback: () => this.resize(),
      element: [container, ...this._nodes.elements],
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

  /** Resizes the marquee, recalculating element positions and cloning if necessary. */
  @noopIfDestroyed
  public resize() {
    const { props, isVertical, gap } = this;
    const { container } = props;

    // Update container width
    const containerSize = isVertical
      ? container.offsetHeight
      : container.offsetWidth;
    this._containerSize = containerSize;

    // Update element sizes
    this._sizes = this._nodes.elements.map(
      (el) => (isVertical ? el.offsetHeight : el.offsetWidth) + gap,
    );
    this._totalSize = this._sizes.reduce((a, b) => a + b, 0);

    // Determine how many times to duplicate elements
    const maxSize = Math.max(...this._sizes);
    const copyTimes = Math.ceil((containerSize + maxSize) / this._totalSize);

    // update total size
    this._totalSize = Math.max(this._totalSize, containerSize + maxSize);

    // Clone elements if necessary
    if (props.cloneNodes && isFiniteNumber(copyTimes) && copyTimes > 1) {
      this._nodes.cloneAll(copyTimes - 1);
      this.resize();
    }

    // Trigger resize callbacks
    this.callbacks.emit('resize', undefined);

    // Rerender the marquee
    setTimeout(() => this.render(0), 0);
  }

  /** Renders the marquee, adjusting element positions. */
  @noopIfDestroyed
  public render(step?: number) {
    this._render(step);
  }

  /**
   * Renders the marquee, calculating element positions based on the provided speed.
   */
  private _render(stepProp = this.props.speed) {
    if (this.isDestroyed) {
      return;
    }

    const { isVertical, props, gap } = this;
    const { elements } = this._nodes;

    // Calculate step
    const rawStep = this._isRtl ? -stepProp : stepProp;
    const step = toPixels(rawStep);

    if (!isFiniteNumber(step)) {
      return;
    }

    // Update animation time
    this._coord -= step;

    // Calculate current position of the elements
    const centerCoord = this._containerSize * 0.5 + this._sizes[0] / 2 - gap;
    const position = this._coord + (props.centered ? centerCoord : 0);

    // Update each element's position
    let prevStaticCoord = 0;
    for (let index = 0; index < elements.length; index += 1) {
      const element = elements[index];
      const elementSize = this._sizes[index];
      const { style } = element;

      const coord = loop(
        position + prevStaticCoord,
        -elementSize,
        this._totalSize - elementSize,
      );

      // Apply transformations to position the element
      if (isVertical) {
        const x = style.position === 'relative' ? '0' : '-50%';
        style.transform = `translate(${x}, ${coord}px)`;
      } else {
        const y = style.position === 'relative' ? '0' : '-50%';
        style.transform = `translate(${coord}px, ${y})`;
      }

      prevStaticCoord += elementSize;
    }

    // Trigger render callbacks
    this.callbacks.emit('render', undefined);
  }

  /** Handle intersection observer */
  private _handleIntersection(entries: IntersectionObserverEntry[]) {
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

    this._lastSetup?.();

    // Remove all children and restore the initial nodes
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Restore the initial nodes
    this._nodes.destroy();

    // Restore container style
    removeMarqueeContainerStyles(container);
  }
}
