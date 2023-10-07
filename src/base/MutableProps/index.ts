import { mergeWithoutArrays } from '@/utils/common';
import { NCallbacks } from '../Callbacks/types';
import { NMutableProps } from './types';

export type { NMutableProps };

/**
 * A class for creating mutable properties that can change on window resize. <br><br>
 *
 * There are two ways to change properties:
 * - To set a resize-listener on window (or use {@linkcode Viewport}).
 * When the window is resized, change the properties with the help of
 * {@linkcode MutableProps.changeProps}
 * 
 * - The second way is to use the MutableProps and add responsive properties
 * with help of {@linkcode MutableProps.addResponsiveProps}.
 *
 * @example
 * 
 * interface IStatic {
 *   static: string;
 * }

 * interface IChangeable {
 *   changeable: string;
 * }

 * const props = new MutableProps<IStatic, IChangeable>({
 *   static: '',
 *   changeable: 'something',
 * });

 * props.addResponsiveProps({
 *   breakpoint: 'viewport_phone',
 *   settings: {
 *     changeable: 'phone',
 *   },
 * });

 * props.changeProps({ changeable: 'changed' });
 */
export class MutableProps<
  /**
   * Static Properties (they never change)
   */
  StaticProps extends Record<string, any>,
  /**
   * Mutable Properties
   * (may change on window resize or through {@linkcode MutableProps.changeProps})
   */
  ChangeableProps extends Record<string, any>
> {
  /**
   * Vevet Application.
   */
  private _app: typeof window.vevetApp;

  /**
   * Reference properties.
   * These properties may change only through {@linkcode MutableProps.changeProps}.
   */
  private _refProps: StaticProps & ChangeableProps;

  /**
   * Current properties.
   * These properties may change both on {@linkcode MutableProps.changeProps} and resize.
   */
  private _props: StaticProps & ChangeableProps;

  /**
   * A set of responsive rules
   */
  private _responsiveRules: NMutableProps.IResponsive<ChangeableProps>[] = [];

  /**
   * Get current properties
   */
  get props() {
    return this._props;
  }

  /**
   * Viewport callback
   */
  private _viewportCallback?: NCallbacks.IAddedCallback;

  /**
   * Active breakpoints used to define if properties have changed
   */
  private _activeBreakpoints: (string | number)[];

  /**
   * @example
   *
   * const static = {
   *   myProp: true,
   * };
   *
   * const responsive = [
   *   {
   *     breakpoint: 'm',
   *     settings: {
   *       myProp: false
   *     }
   *   }
   * ];
   *
   * const props = new MutableProps(static, responsive);
   */
  constructor(
    /**
     * The properties that were set while initialization.
     * These properties will nevet change.
     */
    private _initProps: StaticProps & ChangeableProps,
    /**
     * A callback that is launched when properties are changed
     */
    private _onMutate: () => void = () => {},
    /**
     * Name of the responsive properties.
     */
    private _name = 'Responsive Props'
  ) {
    this._app = window.vevetApp;
    this._refProps = mergeWithoutArrays({}, _initProps);
    this._props = mergeWithoutArrays({}, _initProps);

    this._activeBreakpoints = [];
  }

  /**
   * Add responsive rules
   */
  public addResponsiveProps(rules: NMutableProps.IResponsive<ChangeableProps>) {
    this._responsiveRules.push(rules);

    this._responseProps();

    if (typeof this._viewportCallback !== 'undefined') {
      return;
    }

    this._viewportCallback = this._app.viewport.add(
      'width',
      this._responseProps.bind(this),
      { name: this._name }
    );
  }

  /**
   * Change properties according to the "responsive" settings
   */
  private _responseProps() {
    const app = this._app;
    const { viewport } = app;

    let newProps: (StaticProps & ChangeableProps) | false = false;
    const statProp = mergeWithoutArrays({}, this._refProps);

    const prevActiveBreakpointsString = [...this._activeBreakpoints].join('_');
    this._activeBreakpoints = [];

    // go through all breakpoints
    // and check if a proper breakpoint exists
    this._responsiveRules.forEach(({ settings, breakpoint }) => {
      if (typeof breakpoint === 'number') {
        if (viewport.width <= breakpoint) {
          this._activeBreakpoints.push(breakpoint);
          newProps = mergeWithoutArrays(statProp, settings);
        }
      } else if (typeof breakpoint === 'string') {
        // viewport size
        if (
          (breakpoint === 'viewport_desktop' && viewport.isDesktop) ||
          (breakpoint === 'viewport_tablet' && viewport.isTablet) ||
          (breakpoint === 'viewport_phone' && viewport.isPhone)
        ) {
          this._activeBreakpoints.push(breakpoint);
          newProps = mergeWithoutArrays(statProp, settings);
        }

        // device type
        if (
          (breakpoint === 'device_phone' && app.isPhone) ||
          (breakpoint === 'device_tablet' && app.isTablet) ||
          (breakpoint === 'device_mobile' && app.isMobile)
        ) {
          this._activeBreakpoints.push(breakpoint);
          newProps = mergeWithoutArrays(statProp, settings);
        }
      }
    });

    // check if properties really changed
    const activeBreakpointsString = this._activeBreakpoints.join('_');
    const isPropsChanged =
      activeBreakpointsString !== prevActiveBreakpointsString;

    // if there's no breakpoint, restore the props
    if (!newProps) {
      this._props = mergeWithoutArrays(this._props, this._refProps);
    } else {
      // otherwise, change the properties
      this._props = mergeWithoutArrays(this._props, newProps);
    }

    // callback
    if (isPropsChanged) {
      this._onMutate();
    }
  }

  /**
   * This method allows you to change the properties manually.
   */
  public changeProps(props: Partial<ChangeableProps>) {
    this._props = mergeWithoutArrays(this._props, props);
    this._refProps = mergeWithoutArrays(this._refProps, props);

    this._onMutate();
  }

  /**
   * Destroy the responsive properties.
   */
  public destroy() {
    if (this._viewportCallback) {
      this._viewportCallback.remove();
    }
  }
}
