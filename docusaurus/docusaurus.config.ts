import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'vevet',
  tagline: 'a flexible client-side JavaScript library for creative web development',
  favicon: 'img/favicon.ico',
  url: 'https://antonbobrov.github.io/',
  baseUrl: '/vevet/',
  organizationName: 'antonbobrov',
  projectName: 'vevet',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/antonbobrov/vevet/tree/master/docusaurus',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    navbar: {
      logo: {
        alt: 'Vevet Logo',
        src: 'img/vevet-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: '/v5/',
          label: 'Typedoc (v5)',
          position: 'left',
          target: "_blank",
        },
        {
          href: '/v4/',
          label: 'Legacy (v4)',
          position: 'left',
          target: "_blank",
        },
        {
          href: 'https://github.com/antonbobrov/vevet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
    
    algolia: {
      appId: 'MSAF9XJGA7',
      apiKey: '3ca26ace2526c74dccc014381db15fe5',
      indexName: 'antonbobrovio',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
