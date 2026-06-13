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

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/markdown',
        href: 'https://vevetjs.com/llms.txt',
        title: 'LLM documentation index',
      },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'vevet.js',
        alternateName: ['vevet', 'Vevet.js'],
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web browser',
        description:
          'Flexible client-side JavaScript library for creative web development: split text, carousels, marquees, preloaders, canvas, custom cursor, scroll tools, and more.',
        url: 'https://vevetjs.com/',
        downloadUrl: 'https://www.npmjs.com/package/vevet',
        softwareVersion: '5',
        license: 'https://opensource.org/licenses/MIT',
        author: {
          '@type': 'Person',
          name: 'Anton Bobrov',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    },
  ],

  plugins: [
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'vevet.js',
        siteDescription:
          'vevet.js (npm: vevet) — client-side JavaScript library for creative web development. v5 · import { vevet, SplitText, Snap } from "vevet". All components extend Module. API: component sections below. Working examples: Demos pages (HTML/CSS/JS included). Full export: llms-full.txt.',
        depth: 2,
        optionalLinks: [
          {
            title: 'GitHub repository',
            url: 'https://github.com/antonbobrov/vevet',
            description: 'Source code, issues, changelog',
          },
          {
            title: 'npm package',
            url: 'https://www.npmjs.com/package/vevet',
            description: 'Install via npm install vevet',
          },
          {
            title: 'TypeDoc API reference (v5)',
            url: 'https://vevetjs.com/v5/',
            description: 'Generated TypeScript API docs',
          },
          {
            title: 'Full documentation export',
            url: 'https://vevetjs.com/llms-full.txt',
            description:
              'All docs and demo code as markdown in a single file',
          },
          {
            title: 'AGENTS.md (for coding agents)',
            url: 'https://github.com/antonbobrov/vevet/blob/master/AGENTS.md',
            description: 'Repository guide for AI coding assistants',
          },
        ],
        content: {
          enableMarkdownFiles: false,
          enableLlmsFullTxt: true,
          relativePaths: false,
          includeDocs: true,
          includeBlog: false,
          includePages: false,
          excludeRoutes: ['**/search**'],
        },
        includeOrder: ['docs/intro', 'docs/core/**', 'docs/base/**'],
      },
    ],
  ],

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

    metadata: [
      {
        name: 'description',
        content:
          'Vevet.js — flexible JavaScript library for creative web development. Timeline, scroll, split text, preloaders, canvas and more.',
      },
      {
        name: 'keywords',
        content:
          'vevet, vevet.js, javascript library, creative web development, animation, timeline, scroll, split text, preloader, canvas, marquee, swipe',
      },
    ],

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
