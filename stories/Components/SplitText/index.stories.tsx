import React from 'react';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/SplitText',
  component: Component,
  args: {
    text: ' <b>Lorem</b>😃ipsum &Ccirc; dolor <b style="color: red;">sit</b> amet,&nbsp;consectetur adipiscing elit, <span style="color: blue;">sed <b><i>d</i>o</b></span> eius<b>m<i>od</i></b> tempor <i>incididunt ut</i> labore et dolore magna aliqua. <br /> <br /><br /> <button type="button" style="font: inherit; background-color: #ccc;">Ut enim</button> ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    letters: false,
    lines: false,
  },
};

export const WithLetters: StoryObj<TComponent> = {
  args: {
    letters: true,
    lines: false,
  },
};

export const WithLines: StoryObj<TComponent> = {
  args: {
    letters: false,
    lines: true,
  },
};

export const WithLinesWrapper: StoryObj<TComponent> = {
  args: {
    letters: false,
    lines: true,
    linesWrapper: true,
  },
};

export const WithReactChildren: StoryObj<TComponent> = {
  args: {
    letters: true,
    lines: true,
    text: undefined,
    children: (
      <>
        <b>
          <button
            type="button"
            onClick={() => alert('action')}
            style={{ font: 'inherit' }}
          >
            Lorem
          </button>
        </b>
        😃ipsum dolor sit amet, consectetur adipiscing elit.
      </>
    ),
  },
};

export const WithIgnore: StoryObj<TComponent> = {
  args: {
    letters: false,
    lines: true,
    linesWrapper: true,
    ignore: 'sup',
    text: '<b>Если вам&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;близко<sup>™<u>™</u></sup><sup>1</sup></b> test<sup>™</sup> <sup>™</sup> написанное выше, не<br> стесняйтесь постучаться в телеграм<span style="display: inline-flex; align-items: center;"><span style="display: block; width: 2em; height: 2em; border-radius: 50%; background-color: red;">test</span>Жене</span>,<span style="display: inline-flex; align-items: center;"><span style="display: block; width: 2em; height: 2em; border-radius: 50%; background-color: red;"></span>Диме</span>или<span style="display: inline-flex; align-items: center;"><span style="display: block; width: 2em; height: 2em; border-radius: 50%; background-color: red;"></span>Даше</span>будем рады познакомиться, отсмотреть ваше портфолио и обсудить возможные точки соприкосновения',
  },
};
