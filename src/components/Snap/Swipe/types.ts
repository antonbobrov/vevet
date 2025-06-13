export interface ISnapSwipeProps {
  /**
   * Enable or disable swipe events
   * @default true
   */
  swipe?: boolean;

  /**
   * User will see the "grab" cursor when hovering and "grabbing" when swiping
   * @default false
   */
  grabCursor?: boolean;

  /**
   * Speed factor for swipe movements
   * @default 1
   */
  swipeSpeed?: number;

  /**
   * Swipe axis
   * @default 'auto'
   */
  swipeAxis?: 'x' | 'y' | 'auto';

  /**
   * If disabled, then slider will be animated only when you release the finger, it will not move while you hold your finger on it.
   * @default true
   */
  followSwipe?: boolean;

  /**
   * When `true`, swipes shorter than `shortSwipeDuration` can trigger slide change.
   * Short swipes work only when `followSwipe` is `true`.
   * @default true
   */
  shortSwipes?: boolean;

  /**
   * Short swipe maximum duration
   * @default 300
   */
  shortSwipesDuration?: number;

  /**
   * Minimum distance in pixels to trigger slide change for short swipes
   * @default 30
   */
  shortSwipesThreshold?: number;

  /**
   * Defines if `friction` is allowed when swiping. Doesn't work with short swipes or when when `followSwipe` is `false`
   * @default false
   */
  swipeFriction?: boolean;

  /**
   * Linear interpolation factor for smooth progress updates during swipe move. `false` means that the main `lerp` option will be used
   * @default `vevet.mobile ? 1 : 0.6`
   */
  swipeLerp?: number | false;

  /**
   * Length in pixels that must be swiped to trigger swipe start.
   * @default 5
   */
  swipeThreshold?: number;

  /**
   * Minimum time in milliseconds to trigger swipe move.
   * @default 0
   */
  swipeMinTime?: number;

  /**
   * Inertia strength.
   * @default 1
   */
  swipeInertiaRatio?: number;
}
