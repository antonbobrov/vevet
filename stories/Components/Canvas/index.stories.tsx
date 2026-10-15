import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Canvas/props';
import type { IViewportCallbacksMap } from '@/index';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

type TViewportTarget = keyof IViewportCallbacksMap;

const viewportTargetOptions = [
  'any',
  'width',
  'height',
  'both',
  'onlyWidth',
  'onlyHeight',
  'trigger',
] satisfies TViewportTarget[];

const meta: Meta<TComponent> = {
  title: 'Components/Canvas',
  component: Component,
  args: {
    append: STATIC_PROPS.append,
    resizeOnInit: STATIC_PROPS.resizeOnInit,
    resizeOnRuntime: STATIC_PROPS.resizeOnRuntime,
    viewportTarget: STATIC_PROPS.viewportTarget,
    resizeDebounce: STATIC_PROPS.resizeDebounce,
    width: MUTABLE_PROPS.width,
    height: MUTABLE_PROPS.height,
    dpr: MUTABLE_PROPS.dpr,
  },
  argTypes: {
    append: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    resizeOnInit: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    resizeOnRuntime: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    viewportTarget: {
      control: 'select',
      options: viewportTargetOptions,
      table: { category: STATIC_NAME },
    },
    resizeDebounce: {
      control: { type: 'number', min: 0, step: 100 },
      table: { category: STATIC_NAME },
    },
    width: {
      control: 'select',
      options: ['auto', 100, 200, 300, 400],
      table: { category: MUTABLE_NAME },
    },
    height: {
      control: 'select',
      options: ['auto', 100, 200, 300, 400],
      table: { category: MUTABLE_NAME },
    },
    dpr: {
      control: 'select',
      options: ['auto', 1, 2, 3],
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};
