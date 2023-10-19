import { selectOne } from 'vevet-dom';
import { NMarquee } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { wrap } from '@/utils/math';
import { onResize } from '@/utils/listeners/onResize';
import { AnimationFrame } from '../AnimationFrame';

export type { NMarquee };

/**
 * Custom Marquee
 */
export class Marquee<
  StaticProps extends NMarquee.IStaticProps = NMarquee.IStaticProps,
  ChangeableProps extends NMarquee.IChangeableProps = NMarquee.IChangeableProps,
  CallbacksTypes extends NMarquee.ICallbacksTypes = NMarquee.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      viewportTarget: 'width',
      resizeDebounce: 0,
      speed: 1,
      isEnabled: true,
      pauseOnHover: false,
      prependWhitespace: true,
      isFpsNormalized: true,
    };
  }

  get prefix() {
    return `${this.app.prefix}marquee`;
  }

  /** Marquee container */
  protected _container: HTMLElement;

  /** Marquee container */
  get container() {
    return this._container;
  }

  /** Initial html */
  protected _initialHTML: string;

  /** Mutation observer */
  protected _mutationObserver?: MutationObserver;

  /** Items quantity */
  protected _quantity: number;

  /** Items */
  protected _items: HTMLElement[];

  /** Single item width */
  protected _itemWidth: number;

  /** X Coordinate */
  protected _xCoord: number;

  /** Can play */
  protected _canPlay: boolean;

  /** Animation frame */
  private _animationFrame?: AnimationFrame;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._container = selectOne(this.props.container)! as HTMLElement;
    if (!(this._container instanceof HTMLElement)) {
      throw new Error('No container');
    }

    this.toggleClassName(this._container, this.className(''), true);

    this._initialHTML = this._container.innerHTML;
    this._quantity = 0;
    this._items = [];
    this._itemWidth = 0;
    this._xCoord = 0;
    this._canPlay = true;

    this.resize();

    if (canInit) {
      this.init();
    }
  }

  /** Init the class */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /** Handle properties mutation */
  protected _onPropsMutate() {
    super._onPropsMutate();

    if (this.props.isEnabled) {
      this._animationFrame?.play();
    } else {
      this._animationFrame?.pause();
    }
  }

  /** Set module event */
  protected _setEvents() {
    const { container, props } = this;
    const {
      pauseOnHover: hasPauseOnHover,
      viewportTarget,
      resizeDebounce,
    } = props;

    // create animation frame
    this._animationFrame = new AnimationFrame();
    this._animationFrame.addCallback('frame', () => this._render());
    this.addDestroyableAction(() => this._animationFrame?.destroy());

    // initial play
    if (this.props.isEnabled) {
      this._animationFrame.play();
    }

    // pause on hover
    this.addEventListener(container, 'mouseenter', () => {
      if (hasPauseOnHover) {
        this._canPlay = false;
      }
    });

    // play on mouseleave
    this.addEventListener(container, 'mouseleave', () => {
      this._canPlay = true;
    });

    // resize the scene
    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: this.container,
      viewportTarget,
      resizeDebounce,
      hasBothEvents: true,
    });
    this.addDestroyableAction(() => resizeHandler.remove());
  }

  public resize() {
    this._createItems();
  }

  protected _createItems() {
    this._disconnectMutations();

    const { container } = this;

    // clear
    this._quantity = 0;
    this._items = [];
    this.container.innerHTML = '';

    // apply styles to the container
    container.style.position = 'relative';
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.overflow = 'hidden';
    container.style.whiteSpace = 'nowrap';

    // create the first item and get its sizes
    // to calculate the further quantity of inner elements
    const firstItem = this._createItem(true);

    // get first item width
    let itemWidth = firstItem.clientWidth;
    if (itemWidth <= 0) {
      itemWidth = window.innerWidth;
    }
    this._itemWidth = itemWidth;

    // get items quantity
    if (itemWidth < container.clientWidth) {
      this._quantity = Math.ceil(
        (container.clientWidth + itemWidth) / itemWidth
      );
    }
    this._quantity = Math.max(this._quantity, 4);

    // now when we know the total quantity,
    // we can create the rest of the items
    for (let index = 1; index < this._quantity; index += 1) {
      this._createItem(false);
    }

    // render for the first time
    this._render(0);

    // enable mutation observer
    this._observeMutations();
  }

  /** Create a single item */
  protected _createItem(isFirst = false) {
    const element = document.createElement('div');
    element.classList.add(this.className('__element'));

    if (!isFirst) {
      element.setAttribute('aria-hidden', 'true');
    }

    const prefix = `${this.props.prependWhitespace ? '&nbsp;' : ''}`;
    const body = this._initialHTML;

    element.innerHTML = `${prefix}${body}`;

    // apply styles
    if (!isFirst) {
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
    }

    element.style.display = 'inline-block';

    // append the element
    this.container.appendChild(element);
    this._items.push(element);

    return element;
  }

  /**
   * Observe DOM changes
   * If a change happens inside the parent element,
   * we recreate the marquee element
   */
  protected _observeMutations() {
    if (this._mutationObserver) {
      return;
    }

    const config: MutationObserverInit = {
      childList: true,
    };

    const callback: MutationCallback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this._initialHTML = this.container.innerHTML;

          this._createItems();
        }
      });
    };

    this._mutationObserver = new MutationObserver(callback);
    this._mutationObserver.observe(this.container, config);
  }

  /**
   * Destroy mutation observer
   */
  protected _disconnectMutations() {
    this._mutationObserver?.disconnect();
    this._mutationObserver = undefined;
  }

  /** Render marquee */
  public render(speed = this.props.speed) {
    this._render(speed);
  }

  /** Render marquee */
  protected _render(speedProp?: number) {
    if (!this._canPlay) {
      return;
    }

    const { _quantity: qunantity, _itemWidth: itemWidth, props } = this;
    const { isFpsNormalized } = props;

    const fpsMultiplier = isFpsNormalized
      ? this._animationFrame?.easeMultiplier ?? 1
      : 1;

    const defaultSpeed = props.speed * fpsMultiplier;
    const speed = speedProp ?? defaultSpeed;

    this._xCoord -= speed;

    // get total width
    const totalWidth = itemWidth * (qunantity - 1);

    // render elements
    for (let index = 0; index < qunantity; index += 1) {
      const element = this._items[index];

      // calulate transforms
      const x = wrap(-itemWidth, totalWidth, this._xCoord + itemWidth * index);

      // apply transforms
      element.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, 0, 0,1)`;
    }

    // callbacks
    this.callbacks.tbt('render', undefined);
  }

  protected _destroy() {
    super._destroy();

    this._disconnectMutations();

    this.container.innerHTML = this._initialHTML;
  }
}
