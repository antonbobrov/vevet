import { IVevetProps } from './types';
import { IVevet } from './global';
import { IOnPageLoad } from './events/createOnPageLoad/types';
import {
  IViewportCallbackTypes,
  IViewport,
} from './events/createViewport/types';
import { viewportCssVarsScript } from './events/createViewport/viewportCssVarsScript';

export { viewportCssVarsScript };

export type {
  IVevetProps,
  IVevet,
  IOnPageLoad,
  IViewportCallbackTypes,
  IViewport,
};
