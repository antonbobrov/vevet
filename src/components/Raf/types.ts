import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
} from '@/base/Module/types';
import { TSpring } from '@/utils';

/**
 * Ease for named Raf entries:
 * - `number` → {@link Raf.damp}
 * - {@link TSpring} → spring
 */
export type TRafEase = number | TSpring;

/** Named entry tracked by {@link Raf.add} and interpolated each frame. */
export type TRafEntry = {
  /** Current interpolated value. */
  value: number;

  /**
   * Value to lerp toward. Defaults to {@link value} when omitted in {@link Raf.add}.
   * May be a getter resolved every frame.
   */
  target?: number | (() => number);

  /**
   * Interpolation mode. May be a getter resolved every frame.
   * - `number` — {@link Raf.damp} strength (`@default` `0.1`)
   * - {@link TSpring} — spring
   */
  ease?: TRafEase | (() => TRafEase);

  /**
   * Snap distance for damp / spring. Non-positive / non-finite → `0` (disabled).
   * May be a getter resolved every frame.
   * @default 0.000001
   */
  appx?: number | (() => number);

  /**
   * When `true`, each frame also interpolates a numeric {@link target} toward `0`
   * with the same {@link ease} (before interpolating {@link value}).
   * Ignored for getter targets.
   */
  friction?: boolean;
};

export type TRafStoredEntry = TRafEntry & {
  target: number | (() => number);
  velocity: number;
  /** Spring velocity for friction (target → 0). */
  targetVelocity: number;
};

/** Static properties for the Raf module */
export interface IRafStaticProps extends IModuleStaticProps {}

/** Mutable properties for the Raf module */
export interface IRafMutableProps extends IModuleMutableProps {
  /**
   * Frames per second (FPS) for the animation. Set to 'auto' for dynamic adjustment.
   * @default 'auto'
   */
  fps?: 'auto' | number;

  /**
   * Enables or disables the Raf animation loop.
   * @default false
   */
  enabled?: boolean;

  /**
   * The number of frames after which the FPS is recalculated.
   * @default 10
   */
  fpsRecalcFrames?: number;
}

/** Callbacks for Raf module events */
export interface IRafCallbacksMap extends IModuleCallbacksMap<IRafMutableProps> {
  /** Triggered when the animation starts */
  play: undefined;

  /** Triggered when the animation is paused */
  pause: undefined;

  /** Triggered when play/pause state toggles */
  toggle: undefined;

  /** Triggered on every animation frame */
  frame: {
    /** Current frames per second */
    fps: number;
    /** Scaling coefficient based on a 60 FPS target */
    fpsFactor: number;
    /** Duration of the last frame in ms */
    duration: number;
    /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
    lerpFactor: (factor: number) => number;
  };
}
