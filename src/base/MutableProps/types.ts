export namespace NMutableProps {
  export interface IResponsive<S> {
    /**
     * Defines the breakpoint at which the properties should change.
     * The `breakpoint` can represent either a specific screen width (in pixels)
     * or a predefined device type or viewport size.
     *
     * Available breakpoints:
     * <ul>
     *   <li><code>number</code> - Width breakpoint in pixels, e.g., 768 for tablets or 1024 for desktops.</li>
     *   <li><code>'viewport_desktop'</code> - When the viewport width is categorized as desktop size.</li>
     *   <li><code>'viewport_tablet'</code> - When the viewport width is categorized as tablet size.</li>
     *   <li><code>'viewport_phone'</code> - When the viewport width is categorized as phone size.</li>
     *   <li><code>'device_phone'</code> - When the user is on a phone device, regardless of viewport size.</li>
     *   <li><code>'device_tablet'</code> - When the user is on a tablet device, regardless of viewport size.</li>
     *   <li><code>'device_desktop'</code> - When the user is on a desktop device, regardless of viewport size.</li>
     *   <li><code>'device_mobile'</code> - When the user is on any mobile device (either phone or tablet).</li>
     * </ul>
     */
    breakpoint:
      | number
      | 'viewport_desktop'
      | 'viewport_tablet'
      | 'viewport_phone'
      | 'device_phone'
      | 'device_tablet'
      | 'device_desktop'
      | 'device_mobile';

    /**
     * The property settings that should be applied when the defined breakpoint is matched.
     */
    settings: Partial<S>;
  }
}
