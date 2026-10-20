import { TSwipeInputType } from '../Gesture/types';

/** Callbacks wired from {@link SwipeInput} into {@link Swipe}. */
export interface ISwipeInputHandlers {
  /** First pointer down in a session — cancel inertia / rubber settle. */
  onSessionStart: () => void;
  /** Window move sample — decode, gesture, emit `move`. */
  onMove: (type: TSwipeInputType) => void;
  /** Session-scoped end — direction, `end`, inertia or rubber settle (if swiping). */
  onGestureEnd: () => void;
  /** Global `Pointers.end` — rubber settle when threshold was not crossed. */
  onPointersEnd: () => void;
}
