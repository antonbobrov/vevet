import { getApp } from '@/utils/internal/getApp';
import { NMutableProps } from './types';

export type { NMutableProps };

/**
 * A class for managing mutable properties that can change based on window size (responsive design).
 * This allows certain properties to update dynamically when the window is resized or in response to manual changes.
 *
 * @example
 *
 * interface IStatic {
 *   static: string;
 * }
 *
 * interface IChangeable {
 *   changeable: string;
 * }
 *
 * const props = new MutableProps<IStatic, IChangeable>({
 *   static: '',
 *   changeable: 'something',
 * });
 *
 * props.addResponsiveProps({
 *   breakpoint: 'viewport_phone',
 *   settings: {
 *     changeable: 'phone',
 *   },
 * });
 *
 * props.changeProps({ changeable: 'changed' });
 */
export class MutableProps<
  StaticProps extends Record<string, any>,
  ChangeableProps extends Record<string, any>,
> {
  /**
   * A reference to the original properties (both static and changeable).
   * These properties are only updated manually via {@linkcode changeProps}.
   */
  private _ref: StaticProps & ChangeableProps;

  /**
   * The current active properties. These can be updated through both window resizing
   * (via responsive rules) and manual changes through {@linkcode changeProps}.
   */
  private _props: StaticProps & ChangeableProps;

  /**
   * A set of responsive rules defining how properties should change based on viewport size or device type.
   * Each rule is defined by a breakpoint and corresponding property settings.
   */
  private _rules: NMutableProps.IResponsive<ChangeableProps>[] = [];

  /**
   * The active breakpoints currently applied to the properties.
   */
  private _activeBreakpoints: (string | number)[];

  /**
   * A callback used to update properties when the viewport size changes.
   */
  private _onViewport?: () => void;

  /**
   * Initializes the `MutableProps` instance with static and changeable properties,
   * and sets up a mutation callback to be called when properties change.
   *
   * @param initProps - Initial properties, including both static and changeable properties.
   * @param _onMutate - Callback function triggered whenever the properties change.
   * @param _name - The name used to identify the set of responsive properties.
   */
  constructor(
    initProps: StaticProps & ChangeableProps,
    private _onMutate: () => void = () => {},
    private _name = 'Responsive Props',
  ) {
    this._ref = { ...initProps };
    this._props = { ...initProps };
    this._activeBreakpoints = [];
  }

  /**
   * Retrieves the current properties.
   * These may change either due to responsive rules or through manual updates.
   */
  get props() {
    return this._props;
  }

  /**
   * Adds responsive rules that define how the properties should change based on viewport breakpoints.
   *
   * @param rules - Responsive rules specifying breakpoints and corresponding property settings.
   */
  public addResponsiveProps(rules: NMutableProps.IResponsive<ChangeableProps>) {
    this._rules.push(rules);

    this._responseProps();

    if (this._onViewport) {
      return;
    }

    this._onViewport = getApp().onViewport(
      'width',
      this._responseProps.bind(this),
      { name: this._name },
    );
  }

  /**
   * Handles updating the properties based on the current viewport size.
   * It checks all responsive rules and applies the appropriate settings for active breakpoints.
   */
  private _responseProps() {
    const app = getApp();

    let newProps: (StaticProps & ChangeableProps) | false = false;
    const statProp = { ...this._ref };

    const prevActiveBreakpointsString = [...this._activeBreakpoints].join('_');
    this._activeBreakpoints = [];

    // Evaluate each responsive rule to see if it should be applied
    this._rules.forEach(({ settings, breakpoint }) => {
      if (typeof breakpoint === 'number') {
        if (app.width <= breakpoint) {
          this._activeBreakpoints.push(breakpoint);
          newProps = { ...statProp, ...settings };
        }
      } else if (typeof breakpoint === 'string') {
        // viewport size
        if (
          (breakpoint === 'viewport_desktop' && app.breakpoint === 'desktop') ||
          (breakpoint === 'viewport_tablet' && app.breakpoint === 'tablet') ||
          (breakpoint === 'viewport_phone' && app.breakpoint === 'phone')
        ) {
          this._activeBreakpoints.push(breakpoint);
          newProps = { ...(newProps || statProp), ...settings };
        }

        // device type
        if (
          (breakpoint === 'device_phone' && app.isPhone) ||
          (breakpoint === 'device_tablet' && app.isTablet) ||
          (breakpoint === 'device_desktop' && app.isDesktop) ||
          (breakpoint === 'device_mobile' && app.isMobile)
        ) {
          this._activeBreakpoints.push(breakpoint);
          newProps = { ...(newProps || statProp), ...settings };
        }
      }
    });

    // check if properties really changed
    const activeBreakpointsString = this._activeBreakpoints.join('_');
    const isPropsChanged =
      activeBreakpointsString !== prevActiveBreakpointsString;

    // if there's no breakpoint, restore the props
    if (!newProps) {
      this._props = { ...this._props, ...this._ref };
    } else {
      // otherwise, change the properties
      this._props = { ...this._props, ...(newProps as any) };
    }

    // Call the mutation callback if properties have changed
    if (isPropsChanged) {
      this._onMutate();
    }
  }

  /**
   * Manually changes the properties. The updated properties persist and trigger the mutation callback.
   *
   * @param props - A partial set of changeable properties to be updated.
   */
  public changeProps(props: Partial<ChangeableProps>) {
    this._props = { ...this._props, ...props };
    this._ref = { ...this._ref, ...props };

    this._onMutate();
  }

  /**
   * Cleans up and destroys the responsive properties.
   */
  public destroy() {
    this._onViewport?.();
  }
}
