import { ICursorCallbacksMap } from '@/components';

export const LOG_EVENTS: Record<keyof ICursorCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  render: false,
  hoverEnter: true,
  hoverLeave: true,
  typeShow: true,
  typeHide: true,
  noType: true,
};
