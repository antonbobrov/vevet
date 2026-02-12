import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'vevet.js',
  tagline: 'a flexible JavaScript library for creative web development',
  favicon: 'img/favicon.ico',
  url: 'https://vevetjs.com/',
  baseUrl: '/',
  organizationName: 'antonbobrov',
  projectName: 'vevet',
  onBrokenLinks: 'throw',

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
        sitemap: {},
        gtag: {
          trackingID: 'G-KSMP6NQ3RZ',
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
        alt: 'vevet.js logo',
        src: 'img/vevet-logo-ub.svg',
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
          target: '_blank',
        },
        {
          href: '/v4/',
          label: 'Legacy (v4)',
          position: 'left',
          target: '_blank',
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
      appId: '38KHSXH1BV',
      apiKey: '97f484a607220fbe1ecef8d25e8f36f7',
      indexName: 'Vevet',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
