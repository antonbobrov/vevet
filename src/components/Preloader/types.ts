import { NComponent } from '@/base/Component/types';

export namespace NPreloader {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The preloader container. You may use a CSS selector, the element itself
     * or false if you need only preloader callbacks
     * @default '#v-preloader'
     */
    container?: string | HTMLElement | false;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Automatically hide the preloader container.
     * Set `false` to disable hiding animation (do it manually).
     * Set `number` to define animation duration.
     * @default 250
     */
    hideAnimation?: false | number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    loaded: undefined;
    hide: undefined;
    hidden: undefined;
  }
}
