import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import { initVevet } from '@/global/initVevet';
import {
  isFiniteNumber,
  isHTMLElement,
  noopIfDestroyed,
  TRequiredProps,
  isRtl,
} from '@/internal';
import { onResize, toPixels } from '@/utils';

import { Raf } from '../Raf';

import { MarqueeLayout } from './Layout';
import { MarqueeNodes } from './Nodes';
import { MarqueePlaybackGate } from './PlaybackGate';
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

type TC = IMarqueeCallbacksMap;
type TS = IMarqueeStaticProps;
type TM = IMarqueeMutableProps;

/**
 * Infinite marquee for horizontal or vertical looping content.
 *
 * - Wraps text nodes when needed and styles child elements for absolute looping
 * - Auto-clones content to avoid visible gaps when `cloneNodes` is enabled
 * - Advances via {@link Raf} and supports FPS-adjusted speed
 * - Can pause on hover and while outside the viewport
 *
 * [Documentation](https://vevetjs.com/docs/Marquee)
 *
 * @group Components
 */
export class Marquee extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** `direction: rtl` on the container for horizontal marquees. */
  private _rtl = false;

  /** Original/wrapped/cloned DOM nodes manager. */
  private _nodes: MarqueeNodes;

  /** Layout helper: measures sizes, clones nodes, and renders transforms. */
  private _layout: MarqueeLayout;

  /** Playback loop used to advance the marquee. */
  private _raf: Raf;

  /** The current marquee coordinate. */
  private _coord = 0;

  constructor(props: TModuleProps<TC, TS, TM, Marquee>) {
    super(props);

    const { container, direction, enabled } = this.props;
    const { isVertical } = this;

    if (!isHTMLElement(container)) {
      throw new Error('Marquee container is not defined');
    }

    this._rtl = isRtl(container) && direction === 'horizontal';

    appleMarqueeContainerStyles({ container, isVertical, isRtl: this._rtl });

    this._nodes = new MarqueeNodes(this);

    new MarqueePlaybackGate(this, (bool) => {
      if (bool) {
        this._raf.play();
      } else {
        this._raf.pause();
      }
    });

    this._layout = new MarqueeLayout(this, this._nodes);

    this._raf = new Raf({ enabled, fpsRecalcFrames: 1 });
    this._raf.on('frame', this._handleRaf.bind(this));

    this.resize();

    const onPageLoad = initVevet().onLoad(() => this.resize());
    this.onDestroy(() => onPageLoad());

    const resizeHandler = onResize({
      callback: () => this.resize(),
      element: [this.props.container, ...this._nodes.elements],
      viewportTarget: 'width',
      resizeDebounce: this.props.resizeDebounce,
    });
    this.onDestroy(() => resizeHandler.remove());
  }

  /** Total size of all elements in the marquee (width or height depending on direction) */
  get totalSize() {
    return this._layout.totalSize;
  }

  /** The current marquee coordinate. */
  get coord() {
    return this._coord;
  }

  set coord(value) {
    this._coord = value;
    this.render(0);
  }

  /** Check if the marquee is vertical */
  get isVertical() {
    return this.props.direction === 'vertical';
  }

  /** Marquee gap */
  get gap() {
    return Math.max(toPixels(this.props.gap), 0);
  }

  /** Syncs mutable props into RAF playback and recalculates layout. */
  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._raf.updateProps({ enabled: this.props.enabled });

    this.resize();
  }

  /** Resizes the marquee, recalculating element positions and cloning if necessary. */
  @noopIfDestroyed
  public resize() {
    this._layout.resize();

    this._emit('resize', undefined);
    setTimeout(() => this.render(0), 0);
  }

  /** Converts RAF timing into marquee movement. */
  private _handleRaf() {
    const { props } = this;

    const factor = props.adjustSpeed ? this._raf.fpsFactor : 1;
    const speed = toPixels(props.speed);

    this.render(speed * factor);
  }

  /** Renders the marquee, adjusting element positions. */
  @noopIfDestroyed
  public render(stepProp = this.props.speed) {
    if (this.isDestroyed) {
      return;
    }

    const rawStep = this._rtl ? -stepProp : stepProp;
    const step = toPixels(rawStep);

    if (!isFiniteNumber(step)) {
      return;
    }

    this._coord -= step;
    this._layout.render(this._coord);

    this._emit('render', undefined);
  }

  /** Stops playback, restores DOM, and removes container styles. */
  protected _destroy() {
    super._destroy();

    const { container } = this.props;

    this._raf.destroy();
    this._nodes.restore();

    removeMarqueeContainerStyles(container);
  }
}
