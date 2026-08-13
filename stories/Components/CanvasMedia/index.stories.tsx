import React from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/CanvasMedia/props';
import type { ICanvasMediaMutableProps, IViewportCallbacksMap } from '@/index';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Video as VideoComponent } from './Video';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TViewportTarget = keyof IViewportCallbacksMap;

const ruleOptions = [
  'cover',
  'contain',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'center',
] satisfies ICanvasMediaMutableProps['rule'][];

const viewportTargetOptions = [
  'any',
  'width',
  'height',
  'both',
  'onlyWidth',
  'onlyHeight',
  'trigger',
] satisfies TViewportTarget[];

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/CanvasMedia',
  component: Component,
  args: {
    append: STATIC_PROPS.append,
    autoRenderVideo: STATIC_PROPS.autoRenderVideo,
    resizeOnInit: STATIC_PROPS.resizeOnInit,
    resizeOnRuntime: STATIC_PROPS.resizeOnRuntime,
    viewportTarget: STATIC_PROPS.viewportTarget,
    resizeDebounce: STATIC_PROPS.resizeDebounce,
    width: MUTABLE_PROPS.width,
    height: MUTABLE_PROPS.height,
    dpr: MUTABLE_PROPS.dpr,
    rule: MUTABLE_PROPS.rule,
  },
  argTypes: {
    append: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    autoRenderVideo: {
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
    rule: {
      control: 'select',
      options: ruleOptions,
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const Video: StoryObj<TComponent> = {
  render: (args) => <VideoComponent {...args} />,
};
