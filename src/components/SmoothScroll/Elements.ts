import { createElement, selectAll, selectOne } from 'vevet-dom';
import { NSmoothScroll } from './types';

type TPickedProps = 'elements' | 'hasWillChange' | 'translatePrecision';

interface IProps
  extends Required<Pick<NSmoothScroll.IStaticProps, TPickedProps>> {
  container: Element;
  wrapperClassName: string;
}

export class Elements {
  private _wrapper!: HTMLElement;

  get wrapper() {
    return this._wrapper;
  }

  private _wrapperExists!: boolean;

  private _elements!: NSmoothScroll.IElement[];

  get elements() {
    return this._elements;
  }

  get props() {
    return this._props;
  }

  constructor(private _props: IProps) {
    this._createWrapper();
    this._createElements();
  }

  /** Create scrollable wrapper */
  private _createWrapper() {
    const { wrapperClassName, container } = this.props;

    const existingWrapper = selectOne(`.${wrapperClassName}`, container);

    if (existingWrapper instanceof HTMLElement) {
      this._wrapper = existingWrapper;
      this._wrapperExists = true;

      return;
    }

    this._wrapper = createElement('div', {
      class: wrapperClassName,
      parent: container,
      children: Array.from(container.children),
    });

    this._wrapperExists = false;
  }

  /** Create scrollable elements */
  private _createElements() {
    if (this.props.elements) {
      this._elements = Array.from(
        selectAll(
          this.props.elements,
          this.props.container,
        ) as NodeListOf<NSmoothScroll.IElement>,
      );
    } else {
      this._elements = [this._wrapper as NSmoothScroll.IElement];
    }

    // add will-change
    if (this.props.hasWillChange) {
      this._elements.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.style.willChange = 'transform';
      });
    }
  }

  /** Update elements' properties */
  public updateProps(scrollLeft: number, scrollTop: number) {
    for (let index = 0; index < this.elements.length; index += 1) {
      const element = this.elements[index];

      // update scroll values
      element.smoothScrollLeft = scrollLeft;
      element.smoothScrollTop = scrollTop;

      // update easing
      const lerpAttr = element.getAttribute('data-smooth-scroll-lerp');
      if (lerpAttr) {
        element.smoothScrollLerp = parseFloat(lerpAttr);
      }
    }
  }

  private _getToFixed(value: number) {
    const { translatePrecision } = this.props;

    if (typeof translatePrecision === 'number') {
      return parseFloat(value.toFixed(translatePrecision));
    }

    return value;
  }

  /** Render elements */
  public render() {
    for (let index = 0; index < this.elements.length; index += 1) {
      const element = this._elements[index];

      const x = this._getToFixed(-element.smoothScrollLeft);
      const y = this._getToFixed(-element.smoothScrollTop);

      element.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, ${y}, 0,1)`;
    }
  }

  /** Check if scroll values are interpolated */
  public getIsEqual() {
    const array = this.elements;

    return array.every(
      ({ smoothScrollLeft, smoothScrollTop }) =>
        smoothScrollLeft === array[0].smoothScrollLeft &&
        smoothScrollTop === array[0].smoothScrollTop,
    );
  }

  public destroy() {
    // remove wrapper
    if (!this._wrapperExists) {
      while (this.wrapper.firstChild) {
        this.props.container.appendChild(this.wrapper.firstChild);
      }

      this._wrapper.remove();
    }

    // reset styles
    this._elements.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.style.transform = '';
      // eslint-disable-next-line no-param-reassign
      element.style.willChange = '';
    });
  }
}
