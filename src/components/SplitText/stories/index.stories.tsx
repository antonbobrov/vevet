import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/SplitText',
  component: Component,
  args: {
    text: ' <b>Lorem</b>ipsum dolor <b style="color: red;">sit</b> amet,&nbsp;consectetur adipiscing elit, <span style="color: blue;">sed <b><i>d</i>o</b></span> eius<b>m<i>od</i></b> tempor <i>incididunt ut</i> labore et dolore magna aliqua. <br /> <br /> <button type="button" style="font: inherit; background-color: #ccc;">Ut enim</button> ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    // text: ' <b style="color: red;">sit</b> amet',
    // text: ' consectetur adipiscing elit',
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const WithLetters: StoryObj<TComponent> = {
  args: {
    hasLetters: true,
    hasLines: false,
  },
};

export const WithWords: StoryObj<TComponent> = {
  args: {
    hasLetters: false,
    hasLines: false,
  },
};

export const WithLines: StoryObj<TComponent> = {
  args: {
    hasLetters: false,
    hasLines: true,
  },
};
