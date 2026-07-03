import { TSwipeInputType } from '../Gesture';

/** Callbacks wired from {@link SwipeInput} into {@link Swipe}. */
export interface ISwipeInputHandlers {
  /** First pointer down in a session — cancel inertia / bounce. */
  onSessionStart: () => void;
  /** Window move sample — decode, gesture, emit `move`. */
  onMove: (type: TSwipeInputType) => void;
  /** Session-scoped end — direction, `end`, inertia or bounce (if swiping). */
  onGestureEnd: () => void;
  /** Global `Pointers.end` — bounce when threshold was not crossed. */
  onPointersEnd: () => void;
}
