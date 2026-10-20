import { EaseOutElastic } from 'easing-progress';
import React from 'react';

import {
  STATIC_PROPS,
  MUTABLE_PROPS,
  SWIPE_DEFAULTS,
} from '@/components/Swipe/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { BallComponent } from './Ball';
import { MoveComponent } from './Move';
import { RotationComponent } from './Rotation';
import { ScrollComponent } from './Scroll';
import { SnapComponent } from './Snap';
import { Component } from './Static';
import { ViewerComponent } from './Viewer';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Swipe',
  component: Component,
  args: {
    buttons: STATIC_PROPS.buttons,
    pointers: STATIC_PROPS.pointers,
    disableUserSelect: STATIC_PROPS.disableUserSelect,
    enabled: MUTABLE_PROPS.enabled,
    relative: MUTABLE_PROPS.relative,
    axis: MUTABLE_PROPS.axis,
    ratio: MUTABLE_PROPS.ratio,
    grabCursor: MUTABLE_PROPS.grabCursor,
    willAbort: MUTABLE_PROPS.willAbort,
    threshold: MUTABLE_PROPS.threshold,
    minTime: MUTABLE_PROPS.minTime,
    directionThreshold: MUTABLE_PROPS.directionThreshold,
    preventEdgeSwipe: MUTABLE_PROPS.preventEdgeSwipe,
    edgeSwipeThreshold: MUTABLE_PROPS.edgeSwipeThreshold,
    preventTouchMove: MUTABLE_PROPS.preventTouchMove,
    requireCtrlKey: MUTABLE_PROPS.requireCtrlKey,
    bounds: MUTABLE_PROPS.bounds,
    overscroll: SWIPE_DEFAULTS.overscroll,
    canRubber: SWIPE_DEFAULTS.canRubber,
    snap: MUTABLE_PROPS.snap,
    boundsOnInertia: SWIPE_DEFAULTS.boundsOnInertia,
    rubberDuration: SWIPE_DEFAULTS.rubberDuration,
    rubberEase: SWIPE_DEFAULTS.rubberEase,
    inertia: MUTABLE_PROPS.inertia,
    inertiaEase: SWIPE_DEFAULTS.inertiaEase,
    inertiaRubberEase: SWIPE_DEFAULTS.inertiaRubberEase,
    inertiaRatio: MUTABLE_PROPS.inertiaRatio,
    inertiaThreshold: MUTABLE_PROPS.inertiaThreshold,
    inertiaMaxVelocity: SWIPE_DEFAULTS.inertiaMaxVelocity,
    modifyInertiaDistance: MUTABLE_PROPS.modifyInertiaDistance,
  },
  argTypes: {
    buttons: {
      table: { disable: true, category: STATIC_NAME },
    },
    pointers: {
      control: { type: 'number', min: 1, step: 1 },
      table: { category: STATIC_NAME },
    },
    disableUserSelect: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    relative: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    axis: {
      control: 'select',
      options: [null, 'x', 'y'],
      table: { category: MUTABLE_NAME },
    },
    ratio: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    grabCursor: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    willAbort: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    threshold: {
      control: { type: 'number', min: 0, step: 1 },
      table: { category: MUTABLE_NAME },
    },
    minTime: {
      control: { type: 'number', min: 0, step: 1 },
      table: { category: MUTABLE_NAME },
    },
    directionThreshold: {
      control: { type: 'number', min: 0, step: 1 },
      table: { category: MUTABLE_NAME },
    },
    preventEdgeSwipe: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    edgeSwipeThreshold: {
      control: { type: 'number', min: 0, step: 1 },
      table: { category: MUTABLE_NAME },
    },
    preventTouchMove: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    requireCtrlKey: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    bounds: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    overscroll: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    canRubber: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    snap: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    boundsOnInertia: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    rubberDuration: {
      control: { type: 'number', min: 0, step: 50 },
      table: { category: MUTABLE_NAME },
    },
    rubberEase: {
      control: 'object',
      table: { category: MUTABLE_NAME },
    },
    inertia: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    inertiaEase: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    inertiaRubberEase: {
      control: 'object',
      table: { category: MUTABLE_NAME },
    },
    inertiaRatio: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    inertiaThreshold: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    inertiaMaxVelocity: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    modifyInertiaDistance: {
      table: { disable: true, category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Static: StoryObj<TComponent> = {
  args: {},
};

export const StaticRelative: StoryObj<TComponent> = {
  args: {
    relative: true,
  },
};

export const Move: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveOverscroll: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    overscroll: () => 200,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveNoOverscroll: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    overscroll: 0,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveNoInertia: StoryObj<TComponent> = {
  args: {
    inertia: false,
    grabCursor: true,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveRightButton: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    buttons: [2],
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveCenterButton: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    buttons: [1],
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveCtrl: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    requireCtrlKey: true,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveTriggerY: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    axis: 'y',
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveRatio: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    ratio: 2.5,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveThreshold: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    threshold: 100,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveMinTime: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    minTime: 750,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveRubberDuration: StoryObj<TComponent> = {
  args: {
    inertia: false,
    grabCursor: true,
    rubberDuration: 1500,
    rubberEase: EaseOutElastic,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveInertiaRubberSpring: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberDuration: 1200,
    rubberEase: { stiffness: 120, damping: 10 },
    inertiaRubberEase: { stiffness: 100, damping: 10 },
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const Snap: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberDuration: 1200,
    rubberEase: { stiffness: 100, damping: 10 },
  },
  render: (arg) => <SnapComponent {...arg}></SnapComponent>,
};

export const Rotation: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberDuration: 1200,
    rubberEase: { stiffness: 100, damping: 10 },
    inertiaRubberEase: { stiffness: 100, damping: 10 },
    bounds: () => ({ angle: [0, 360] }),
  },
  render: (arg) => <RotationComponent {...arg}></RotationComponent>,
};

export const RotationSnap: StoryObj<TComponent> = {
  args: {
    inertia: true,
    inertiaRatio: 0.1,
    grabCursor: true,
    rubberDuration: 1200,
    rubberEase: { stiffness: 100, damping: 10 },
    inertiaRubberEase: { stiffness: 100, damping: 10 },
    bounds: () => ({ angle: [0, 360] }),
    snap: () => ({
      angle: [0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360],
    }),
  },
  render: (arg) => <RotationComponent {...arg}></RotationComponent>,
};

export const Ball: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
  },
  render: (arg) => <BallComponent {...arg}></BallComponent>,
};

export const Scroll: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberEase: { stiffness: 170, damping: 20 },
    inertiaRubberEase: { stiffness: 170, damping: 20 },
  },
  render: (arg) => <ScrollComponent {...arg}></ScrollComponent>,
};

export const ViewerSimple: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberEase: { stiffness: 170, damping: 20 },
    inertiaRubberEase: { stiffness: 170, damping: 20 },
  },
  render: (arg) => (
    <ViewerComponent {...arg} interaction="simple"></ViewerComponent>
  ),
};

export const ViewerPinch: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    rubberEase: { stiffness: 170, damping: 20 },
    inertiaRubberEase: { stiffness: 170, damping: 20 },
  },
  render: (arg) => (
    <ViewerComponent {...arg} interaction="pinch"></ViewerComponent>
  ),
};
