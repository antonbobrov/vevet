import { NComponent } from '@/base/Component';
import { NApplication } from '@/src/Application';

export namespace NBaseTimeline {
  export interface IStaticProps extends NComponent.IStaticProps {
    /** Timeline easing function */
    easing?: NApplication.IProps['easing'];
    /**
     * Timeline scope is used for nested timelines.
     * The first value means that animation will start only when the absolute progress
     * of the parent timeline reaches this value. The second value is
     * the end of animation relatively to the parent timeline.
     * This property should be set for a nested timeline.
     * @default [0, 1]
     */
    nestedScope?: [number, number] | number[];
    /**
     * Define if you want to use easing progress to calculate current progress
     * of nested timelines according to their scope.
     * This property should be set for the parent timeline.
     * @default false
     */
    hasNestedEasingProgress?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface IProgressParameter {
    progress: number;
    easing: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    progress: IProgressParameter;
  }
}
