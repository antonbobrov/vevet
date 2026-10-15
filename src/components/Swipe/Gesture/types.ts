import { ISwipeState } from '../global';

/** Pointer input device for gesture activation checks. */
export type TSwipeInputType = 'touch' | 'mouse';

/**
 * Result of {@link SwipeGesture.sample}.
 *
 * - `ignore` — gesture was aborted
 * - `pending` — threshold not yet passed
 * - `activate` — first frame past threshold (`start` should fire)
 * - `move` — ongoing swipe
 */
export type TSwipeGestureSample =
  | { type: 'ignore' }
  | { type: 'pending' }
  | { type: 'activate'; state: ISwipeState }
  | { type: 'move'; state: ISwipeState };
