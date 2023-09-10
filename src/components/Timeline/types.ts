import { NBaseTimeline } from '../BaseTimeline';

export namespace NTimeline {
  export interface IStaticProps extends NBaseTimeline.IStaticProps {
    /**
     * Destroy the timeline on animation end
     * @default false
     */
    isDestroyOnEnd?: boolean;
  }

  export interface IChangeableProps extends NBaseTimeline.IChangeableProps {
    /**
     * Timeline duration
     * @default 1000
     */
    duration?: number;
  }

  export interface ICallbacksTypes extends NBaseTimeline.ICallbacksTypes {
    start: undefined;
    end: undefined;
  }
}
