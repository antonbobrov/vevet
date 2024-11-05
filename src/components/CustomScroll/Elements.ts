import { selectOne } from '@/utils/dom/selectOne';
import { NCustomScroll } from './types';
import { selectAll } from '@/utils/dom/selectAll';

type TPickedProps = 'elements' | 'hasWillChange' | 'translatePrecision';

interface IProps
  extends Required<Pick<NCustomScroll.IStaticProps, TPickedProps>> {
  container: Element;
  wrapperClassName: string;
}

export class Elements {
  private _wrapper!: HTMLElement;

  get wrapper() {
    return this._wrapper;
  }

  private _elements!: NCustomScroll.IElement[];

  get elements() {
    return this._elements;
  }

  get props() {
    return this._props;
  }

  constructor(private _props: IProps) {
    this._getWrapper();
    this._createElements();
  }

  /** Get scrollable wrapper */
  private _getWrapper() {
    const { wrapperClassName, container } = this.props;

    const existingWrapper = selectOne(`.${wrapperClassName}`, container);

    if (!(existingWrapper instanceof HTMLElement)) {
      throw new Error(`No wrapper found: .${wrapperClassName}`);
    } else {
      this._wrapper = existingWrapper;
    }
  }

  /** Create scrollable elements */
  private _createElements() {
    if (this.props.elements) {
      this._elements = Array.from(
        selectAll(
          this.props.elements,
          this.props.container,
        ) as NodeListOf<NCustomScroll.IElement>,
      );
    } else {
      this._elements = [this._wrapper as NCustomScroll.IElement];
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
      element.customScrollLeft = scrollLeft;
      element.customScrollTop = scrollTop;

      // update easing
      const lerpAttr = element.getAttribute('data-custom-scroll-lerp');
      if (lerpAttr) {
        element.customScrollLerp = parseFloat(lerpAttr);
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

      const x = this._getToFixed(-element.customScrollLeft);
      const y = this._getToFixed(-element.customScrollTop);

      element.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0, ${x}, ${y}, 0,1)`;
    }
  }

  /** Check if scroll values are interpolated */
  public getIsEqual() {
    const array = this.elements;

    return array.every(
      ({ customScrollLeft, customScrollTop }) =>
        customScrollLeft === array[0].customScrollLeft &&
        customScrollTop === array[0].customScrollTop,
    );
  }

  public destroy() {
    // reset styles
    this._elements.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.style.transform = '';
      // eslint-disable-next-line no-param-reassign
      element.style.willChange = '';
    });
  }
}
