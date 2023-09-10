export namespace NMutableProps {
  export interface IResponsive<S> {
    /**
     * The breakpoint at which properties will change.
     * Available breakpoints:
     * <ul>
     *   <li>any number - width breakpoint</li>
     *   <li>'d' - for desktop size</li>
     *   <li>'t' - for tablet size</li>
     *   <li>'p' - for phone size</li>
     *   <li>'phone' - for phone devices</li>
     *   <li>'tablet' - for tablet devices</li>
     *   <li>'mobile' - for phone or tablet devices</li>
     * </ul>
     */
    breakpoint:
      | number
      | 'viewport_desktop'
      | 'viewport_tablet'
      | 'viewport_phone'
      | 'device_phone'
      | 'device_tablet'
      | 'device_mobile';
    settings: Partial<S>;
  }
}
