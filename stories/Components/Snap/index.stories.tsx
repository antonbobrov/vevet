import { EaseOutBack } from 'easing-progress';
import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/Snap/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component as CardsComponent } from './Cards';
import { Component as CardsStackComponent } from './CardsStack';
import { Component as CarouselComponent } from './Carousel';
import { Component as CircularComponent } from './Circular';
import { Component as ExpandComponent } from './Expand';
import { Component as ImpulseGapComponent } from './ImpulseGap';
import { Component as ImpulseSkewComponent } from './ImpulseSkew';
import { Component as PanoramaComponent } from './Panorama';
import { Component as VirtualComponent } from './Virtual';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Snap',
  component: Component,
  args: {
    activeIndex: STATIC_PROPS.activeIndex,
    containerSize: MUTABLE_PROPS.containerSize,
    slidesToScroll: MUTABLE_PROPS.slidesToScroll,
    direction: MUTABLE_PROPS.direction,
    origin: MUTABLE_PROPS.origin,
    loop: MUTABLE_PROPS.loop,
    gap: 10,
    lerp: MUTABLE_PROPS.lerp,
    freemode: MUTABLE_PROPS.freemode,
    rewind: MUTABLE_PROPS.rewind,
    stickOnResize: MUTABLE_PROPS.stickOnResize,
    friction: MUTABLE_PROPS.friction,
    edgeFriction: MUTABLE_PROPS.edgeFriction,
    duration: MUTABLE_PROPS.duration,
    easing: MUTABLE_PROPS.easing,
    swipe: MUTABLE_PROPS.swipe,
    grabCursor: MUTABLE_PROPS.grabCursor,
    swipeSpeed: MUTABLE_PROPS.swipeSpeed,
    swipeAxis: MUTABLE_PROPS.swipeAxis,
    followSwipe: MUTABLE_PROPS.followSwipe,
    shortSwipes: MUTABLE_PROPS.shortSwipes,
    shortSwipesDuration: MUTABLE_PROPS.shortSwipesDuration,
    shortSwipesThreshold: MUTABLE_PROPS.shortSwipesThreshold,
    swipeFriction: MUTABLE_PROPS.swipeFriction,
    swipeThreshold: MUTABLE_PROPS.swipeThreshold,
    swipeMinTime: MUTABLE_PROPS.swipeMinTime,
    swipeInertiaRatio: MUTABLE_PROPS.swipeInertiaRatio,
    wheel: MUTABLE_PROPS.wheel,
    wheelSpeed: MUTABLE_PROPS.wheelSpeed,
    wheelAxis: MUTABLE_PROPS.wheelAxis,
    followWheel: MUTABLE_PROPS.followWheel,
    wheelThrottle: MUTABLE_PROPS.wheelThrottle,
    stickOnWheelEnd: MUTABLE_PROPS.stickOnWheelEnd,
    stickOnWheelEndThreshold: MUTABLE_PROPS.stickOnWheelEndThreshold,
    slideSize: MUTABLE_PROPS.slideSize,
    interval: MUTABLE_PROPS.interval,
    intervalDirection: MUTABLE_PROPS.intervalDirection,
  },
  argTypes: {
    activeIndex: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    containerSize: {
      table: { disable: true, category: MUTABLE_NAME },
    },
    slidesToScroll: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { category: MUTABLE_NAME },
    },
    origin: {
      control: 'select',
      options: ['start', 'center', 'end'],
      table: { category: MUTABLE_NAME },
    },
    loop: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    gap: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    lerp: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    freemode: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    rewind: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    stickOnResize: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    friction: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    edgeFriction: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    duration: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    easing: {
      table: { category: MUTABLE_NAME, disable: true },
    },
    swipe: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    grabCursor: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    swipeSpeed: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    swipeAxis: {
      control: 'select',
      options: ['x', 'y', 'angle', 'auto'],
      table: { category: MUTABLE_NAME },
    },
    followSwipe: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    shortSwipes: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    shortSwipesDuration: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    shortSwipesThreshold: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    swipeFriction: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    swipeThreshold: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    swipeMinTime: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    swipeInertiaRatio: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    wheel: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    wheelSpeed: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    wheelAxis: {
      control: 'select',
      options: ['x', 'y', 'auto'],
      table: { category: MUTABLE_NAME },
    },
    followWheel: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    wheelThrottle: {
      control: 'select',
      options: ['auto', 0, 500, 3000, 10000],
      table: { category: MUTABLE_NAME },
    },
    stickOnWheelEnd: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    stickOnWheelEndThreshold: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    slideSize: {
      table: { category: MUTABLE_NAME, disable: true },
    },
    interval: {
      control: 'select',
      options: [null, 500, 3000, 5000],
      table: { category: MUTABLE_NAME },
    },
    intervalDirection: {
      control: 'select',
      options: ['next', 'prev'],
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {},
};

export const Loop: StoryObj<TComponent> = {
  args: {
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const NoLerp: StoryObj<TComponent> = {
  args: {
    lerp: 1,
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};
export const Center: StoryObj<TComponent> = {
  args: {
    origin: 'center',
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const End: StoryObj<TComponent> = {
  args: {
    origin: 'end',
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const Freemode: StoryObj<TComponent> = {
  args: {
    freemode: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const FreemodeLoop: StoryObj<TComponent> = {
  args: {
    freemode: true,
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const FreemodeSticky: StoryObj<TComponent> = {
  args: {
    freemode: 'sticky',
    shortSwipes: false,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const FreemodeStickyLoop: StoryObj<TComponent> = {
  args: {
    freemode: 'sticky',
    shortSwipes: false,
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const Vertical: StoryObj<TComponent> = {
  args: {
    direction: 'vertical',
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const WheelNoFollow: StoryObj<TComponent> = {
  args: {
    direction: 'vertical',
    followWheel: false,
    wheelThrottle: 'auto',
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const SwipeNoFollow: StoryObj<TComponent> = {
  args: {
    followSwipe: false,
    followWheel: false,
    wheelThrottle: 'auto',
    loop: true,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const Rewind: StoryObj<TComponent> = {
  args: {
    rewind: true,
    followWheel: false,
    wheelThrottle: 'auto',
    wheel: true,
    wheelAxis: 'y',
  },
};

export const Friction: StoryObj<TComponent> = {
  args: {
    friction: 0.3,
    swipeFriction: true,
    shortSwipes: false,
    wheel: true,
    wheelAxis: 'y',
    loop: true,
  },
};

export const WheelNoStickyEnd: StoryObj<TComponent> = {
  args: {
    wheel: true,
    wheelAxis: 'y',
    stickOnWheelEnd: false,
    friction: 0.3,
  },
};

export const Bounce: StoryObj<TComponent> = {
  args: {
    easing: EaseOutBack,
  },
};

export const Smooth: StoryObj<TComponent> = {
  args: {
    duration: 1500,
    lerp: 0.05,
    wheel: true,
    wheelAxis: 'y',
  },
};

export const LongShortSwipes: StoryObj<TComponent> = {
  args: {
    shortSwipes: true,
    shortSwipesDuration: 3000,
  },
};

export const SwipeThreshold: StoryObj<TComponent> = {
  args: {
    swipeThreshold: 50,
  },
};

export const SwipeInertia: StoryObj<TComponent> = {
  args: {
    freemode: true,
    swipeInertiaRatio: 0.1,
  },
};

export const Interval: StoryObj<TComponent> = {
  args: {
    interval: 500,
    loop: true,
  },
};

export const ReverseInterval: StoryObj<TComponent> = {
  args: {
    interval: 500,
    intervalDirection: 'prev',
    loop: true,
  },
};

export const Rtl: StoryObj<TComponent> = {
  args: {
    swipeSpeed: -1,
    loop: true,
  },
  render: (arg) => (
    <div dir="rtl">
      <Component {...arg}></Component>
    </div>
  ),
};

export const RtlEnd: StoryObj<TComponent> = {
  args: {
    origin: 'end',
    swipeSpeed: -1,
    loop: true,
  },
  render: (arg) => (
    <div dir="rtl">
      <Component {...arg}></Component>
    </div>
  ),
};

export const CardsStack: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    freemode: 'sticky',
    gap: 0,
  },
  render: (arg) => <CardsStackComponent {...arg}></CardsStackComponent>,
};

export const Cards: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    origin: 'center',
    loop: true,
    gap: 20,
    wheel: true,
    freemode: 'sticky',
    wheelAxis: 'y',
  },
  render: (arg) => <CardsComponent {...arg}></CardsComponent>,
};

export const Carousel: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    grabCursor: true,
    wheel: true,
    wheelAxis: 'y',
    origin: 'center',
    loop: true,
    shortSwipes: false,
    freemode: 'sticky',
    gap: 0,
  },
  render: (arg) => <CarouselComponent {...arg}></CarouselComponent>,
};

export const Circular: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    wheel: true,
    swipeAxis: 'angle',
    wheelAxis: 'y',
    freemode: true,
    swipeSpeed: -1,
    loop: true,
    gap: 0,
  },
  render: (arg) => <CircularComponent {...arg}></CircularComponent>,
};

export const Expand: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    gap: '1rem',
    wheel: true,
    lerp: 1,
    wheelAxis: 'y',
    freemode: 'sticky',
    shortSwipes: false,
    stickOnResize: false,
    edgeFriction: 0.95,
    grabCursor: true,
  },
  render: (arg) => <ExpandComponent {...arg}></ExpandComponent>,
};

export const ImpulseGap: StoryObj<TComponent> = {
  args: {
    origin: 'center',
    loop: true,
    gap: 5,
    lerp: 0.2,
    freemode: true,
  },
  render: (arg) => <ImpulseGapComponent {...arg}></ImpulseGapComponent>,
};

export const ImpulseSkew: StoryObj<TComponent> = {
  args: {
    origin: 'center',
    loop: true,
    shortSwipes: false,
    gap: 20,
    lerp: 0.2,
    freemode: true,
  },
  render: (arg) => <ImpulseSkewComponent {...arg}></ImpulseSkewComponent>,
};

export const Panorama: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    wheel: true,
    wheelAxis: 'y',
    origin: 'center',
    loop: true,
    gap: 10,
    freemode: 'sticky',
    shortSwipes: false,
    activeIndex: 3,
  },
  render: (arg) => <PanoramaComponent {...arg}></PanoramaComponent>,
};

export const Virtual: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
    wheel: true,
    wheelAxis: 'y',
    swipeAxis: 'x',
    origin: 'center',
    loop: true,
    gap: '5vw',
    freemode: 'sticky',
    shortSwipes: false,
  },
  render: (arg) => <VirtualComponent {...arg}></VirtualComponent>,
};
