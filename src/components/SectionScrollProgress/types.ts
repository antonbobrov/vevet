import { NComponent } from '@/base/Component/types';
import type { CustomScroll } from '../CustomScroll';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NScrollSectionProgress {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The section element that is being tracked for scroll progress.
     * This can be a CSS selector or a direct reference to the element.
     */
    section: string | Element;

    /**
     * The scrollable container in which the section is being scrolled.
     * This can be a CSS selector, a reference to an element, a custom scroll instance, or the window object.
     * @default window
     */
    scrollContainer?: string | Element | CustomScroll | Window;

    /**
     * The target viewport for observing resize events.
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;

    /**
     * The timeout for debouncing resize events (in milliseconds).
     * This defines the delay before executing the resize handler.
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Callback triggered during the render process when the section's scroll progress is updated.
     */
    render: undefined;

    /**
     * Callback triggered when the section or viewport is resized.
     */
    resize: undefined;
  }
}
