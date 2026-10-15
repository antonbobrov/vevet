import React from 'react';

import { GET_STATIC_PROPS } from '@/components/SplitText/props';

import { STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const STATIC_PROPS = GET_STATIC_PROPS('v-split-text');

const meta: Meta<TComponent> = {
  title: 'Components/SplitText',
  component: Component,
  args: {
    text: ' Vevet SplitText is a flexible utility that enables seamless text splitting into words, letters, or lines as needed.',
    ariaLabel: STATIC_PROPS.ariaLabel,
    letters: STATIC_PROPS.letters,
    lines: STATIC_PROPS.lines,
    linesWrapper: STATIC_PROPS.linesWrapper,
    letterTag: STATIC_PROPS.letterTag,
    wordTag: STATIC_PROPS.wordTag,
    lineTag: STATIC_PROPS.lineTag,
    letterClass: STATIC_PROPS.letterClass,
    wordClass: STATIC_PROPS.wordClass,
    lineClass: STATIC_PROPS.lineClass,
    lineWrapperClass: STATIC_PROPS.lineWrapperClass,
    resizeDebounce: STATIC_PROPS.resizeDebounce,
    ignore: STATIC_PROPS.ignore,
    prepareText: STATIC_PROPS.prepareText,
    wordDelimiter: STATIC_PROPS.wordDelimiter,
    wordDelimiterOutput: STATIC_PROPS.wordDelimiterOutput ?? '',
  },
  argTypes: {
    text: {
      control: 'text',
      table: { disable: true },
    },
    ariaLabel: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    letters: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    lines: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    linesWrapper: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    letterTag: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    wordTag: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    lineTag: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    letterClass: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    wordClass: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    lineClass: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    lineWrapperClass: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    resizeDebounce: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    ignore: {
      table: { disable: true },
    },
    prepareText: {
      table: { disable: true },
    },
    wordDelimiter: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    wordDelimiterOutput: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const Letters: StoryObj<TComponent> = {
  args: {
    letters: true,
  },
};

export const Lines: StoryObj<TComponent> = {
  args: {
    lines: true,
  },
};

export const LinesWrapper: StoryObj<TComponent> = {
  args: {
    lines: true,
    linesWrapper: true,
  },
};

export const All: StoryObj<TComponent> = {
  args: {
    letters: true,
    lines: true,
  },
};

export const LetterTag: StoryObj<TComponent> = {
  args: {
    letters: true,
    letterTag: 'i',
  },
};

export const WordTag: StoryObj<TComponent> = {
  args: {
    wordTag: 'i',
  },
};

export const WordDelimiter: StoryObj<TComponent> = {
  args: {
    text: 'Words=split=by=any=symbol',
    wordDelimiter: '=',
    wordDelimiterOutput: '-',
  },
};

export const MultipleNewlines: StoryObj<TComponent> = {
  args: {
    text: 'One<br />Two<br /><br />newlines',
    lines: true,
  },
};

export const HTMLEmoji: StoryObj<TComponent> = {
  args: {
    text: 'SplitText supports multiple <br /><br /><b style="color: #ff8709">newlines</b>,<br /><br /><b style="color: #00bae2">non-breaking&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spaces,</b> <b style="color: #f100cb">nested tags</b> like&nbsp;&lt;span&gt;,&lt;strong&gt;</span>, and handles&nbsp;emojis&nbsp;🥰',
    lines: true,
  },
};

export const Thai: StoryObj<TComponent> = {
  args: {
    text: '<span class="js-ignore">vevet.js</span> เรียบง่ายมาก ฉันชอบมันมาก!',
    ignore: '.js-ignore',
    prepareText: (source) => {
      const segmenter = new Intl.Segmenter('th', { granularity: 'word' });

      return [...Array.from(segmenter.segment(source))]
        .map((s) => s.segment)
        .join(' ');
    },
  },
};

export const Chinese: StoryObj<TComponent> = {
  args: {
    text: '<span class="ignore">vevet.js</span> 太简洁了我爱死它了!',
    ignore: '.js-ignore',
    prepareText: (source) => {
      const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });

      return [...Array.from(segmenter.segment(source))]
        .map((s) => s.segment)
        .join(' ');
    },
  },
};

export const Arabic: StoryObj<TComponent> = {
  args: {
    text: '<span class="js-ignore">vevet.js</span> بسيط جدًا ! أحبه !',
    ignore: '.js-ignore',
    prepareText: (source) => {
      const segmenter = new Intl.Segmenter('ar', { granularity: 'word' });

      return [...Array.from(segmenter.segment(source))]
        .map((s) => s.segment)
        .join(' ');
    },
  },
  render: (args) => (
    <div dir="rtl">
      <Component {...args}></Component>
    </div>
  ),
};
