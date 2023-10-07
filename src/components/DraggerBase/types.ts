import { NComponent } from '@/base/Component/types';

export namespace NDraggerBase {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Draggable element
     * @default '#v-dragger'
     */
    container?: string | Element | Window;
    /**
     * If need to use passive events
     * @default false
     */
    isPassive?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Dragging is enabled
     * @default true
     */
    isEnabled?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    start: IStartParameter;
    end: undefined;
  }

  export type TEvent = MouseEvent | TouchEvent;

  export interface IStartParameter {
    event: TEvent;
    start: IVector2;
    coords: IVector2;
  }

  export interface IVector2 {
    x: number;
    y: number;
  }
}
