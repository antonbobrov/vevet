import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/Swipe/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { BallComponent } from './Ball';
import { MoveComponent } from './Move';
import { RotationComponent } from './Rotation';
import { ScrollComponent } from './Scroll';
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
    bounceDuration: MUTABLE_PROPS.bounceDuration,
    overflow: MUTABLE_PROPS.overflow,
    inertia: MUTABLE_PROPS.inertia,
    inertiaDecay: MUTABLE_PROPS.inertiaDecay,
    inertiaBounceEase: MUTABLE_PROPS.inertiaBounceEase,
    inertiaRatio: MUTABLE_PROPS.inertiaRatio,
    inertiaThreshold: MUTABLE_PROPS.inertiaThreshold,
    maxVelocity: MUTABLE_PROPS.maxVelocity,
    bounds: MUTABLE_PROPS.bounds,
    recalculateBoundsOnInertia: MUTABLE_PROPS.recalculateBoundsOnInertia,
    snap: MUTABLE_PROPS.snap,
    canBounce: MUTABLE_PROPS.canBounce,
    snapRadius: MUTABLE_PROPS.snapRadius,
    inertiaDistanceModifier: MUTABLE_PROPS.inertiaDistanceModifier,
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
    bounceDuration: {
      control: { type: 'number', min: 0, step: 50 },
      table: { category: MUTABLE_NAME },
    },
    overflow: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    inertia: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    inertiaDecay: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    inertiaBounceEase: {
      control: 'number',
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
    maxVelocity: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    bounds: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    recalculateBoundsOnInertia: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    snap: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    canBounce: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    snapRadius: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    inertiaDistanceModifier: {
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
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveNoInertia: StoryObj<TComponent> = {
  args: {
    inertia: false,
    grabCursor: true,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveRightButton: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    buttons: [2],
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveCenterButton: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    buttons: [1],
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveCtrl: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    requireCtrlKey: true,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveTriggerY: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    axis: 'y',
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveRatio: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    ratio: 2.5,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveThreshold: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    threshold: 50,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveMinTime: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    minTime: 750,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveBounceDuration: StoryObj<TComponent> = {
  args: {
    inertia: false,
    grabCursor: true,
    bounceDuration: 7000,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveInertiaBounceEase: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    inertiaBounceEase: 0.05,
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const MoveSnap: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
    snap: () => ({ x: [0, 50, 100, 150, 200, 250] }),
    bounds: () => ({ x: [0, 250], y: [0, 250] }),
    overflow: () => 50,
  },
  render: (arg) => <MoveComponent {...arg}></MoveComponent>,
};

export const Rotation: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
  },
  render: (arg) => <RotationComponent {...arg}></RotationComponent>,
};

export const RotationSnap: StoryObj<TComponent> = {
  args: {
    inertia: false,
    grabCursor: true,
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
  },
  render: (arg) => <ScrollComponent {...arg}></ScrollComponent>,
};

export const ViewerSimple: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
  },
  render: (arg) => (
    <ViewerComponent {...arg} interaction="simple"></ViewerComponent>
  ),
};

export const ViewerPinch: StoryObj<TComponent> = {
  args: {
    inertia: true,
    grabCursor: true,
  },
  render: (arg) => (
    <ViewerComponent {...arg} interaction="pinch"></ViewerComponent>
  ),
};
