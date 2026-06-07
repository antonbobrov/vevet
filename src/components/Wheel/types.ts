import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base';

/** Static properties for the Wheel module */
export interface IWheelStaticProps extends IModuleStaticProps {
  /**
   * todo
   */
  container: HTMLElement;
}

/** Mutable properties for the Wheel module */
export interface IWheelMutableProps extends IModuleMutableProps {
  /**
   * todo
   * @default true
   */
  enabled?: boolean;

  /**
   * Speed factor for mouse wheel movements
   * @default 1
   */
  speed?: number;

  /**
   * Wheel axis
   * @default 'y'
   */
  axis?: 'x' | 'y';

  /**
   * todo
   * @default true
   */
  follow?: boolean;

  /**
   * Throttle wheel events, value in milliseconds.
   * Works only if `follow` is disabled.
   *
   * - `auto` - automatic detection when `wheel` is enabled
   * - `number - value in milliseconds
   *
   * @default `auto`
   */
  throttle?: number | 'auto';
}

/** Callbacks map for the Wheel module */
export interface IWheelCallbacksMap extends IModuleCallbacksMap<IModuleMutableProps> {
  /**
   * todo
   */
  start: undefined;

  /**
   * todo
   */
  end: undefined;

  /**
   * todo
   */
  wheel: WheelEvent;
}
