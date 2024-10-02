import { NComponent } from '@/base/Component/types';

export namespace NPreloader {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The container for the preloader. You can pass a CSS selector string,
     * an HTML element, or set it to `false` if you only need the preloader callbacks.
     *
     * @default '#v-preloader'
     */
    container?: string | HTMLElement | false;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Defines whether to automatically hide the preloader container.
     * Set `false` to disable the hiding animation, allowing you to manage it manually.
     * Set a `number` to specify the animation duration in milliseconds.
     *
     * @default 250
     */
    hideAnimation?: false | number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Triggered when the page is fully loaded.
     */
    loaded: undefined;

    /**
     * Triggered when the preloader starts hiding.
     */
    hide: undefined;

    /**
     * Triggered when the preloader is completely hidden.
     */
    hidden: undefined;
  }
}
