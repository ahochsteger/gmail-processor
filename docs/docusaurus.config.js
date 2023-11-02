// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import { themes } from 'prism-react-renderer';
const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

/** @type {import('@docusaurus/types').Config} */
const config = {
  themes: [
    'docusaurus-json-schema-plugin'
  ],
  title: 'Gmail Processor',
  tagline: 'Process emails with ease',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://ahochsteger.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/gmail-processor/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ahochsteger', // Usually your GitHub org/user name.
  projectName: 'gmail-processor', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/gmail-processor-robot.png',
      navbar: {
        title: 'Gmail Processor',
        logo: {
          alt: 'Gmail Processor',
          src: 'img/logo.svg',
          // src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/playground', label: 'Playground', position: 'left'},
          {
            href: 'https://github.com/ahochsteger/gmail-processor',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        // links: [
        //   {
        //     title: 'Docs',
        //     items: [
        //       {
        //         label: 'Tutorial',
        //         to: '/docs/intro',
        //       },
        //     ],
        //   },
        //   {
        //     title: 'Community',
        //     items: [
        //       {
        //         label: 'Stack Overflow',
        //         href: 'https://stackoverflow.com/questions/tagged/gmail-processor',
        //       },
        //       // {
        //       //   label: 'Discord',
        //       //   href: 'https://discordapp.com/invite/gmail-processor',
        //       // },
        //       // {
        //       //   label: 'Twitter',
        //       //   href: 'https://twitter.com/gmail-processor',
        //       // },
        //     ],
        //   },
        //   {
        //     title: 'More',
        //     items: [
        //       // {
        //       //   label: 'Blog',
        //       //   to: '/blog',
        //       // },
        //       {
        //         label: 'GitHub',
        //         href: 'https://github.com/ahochsteger/gmail-processor',
        //       },
        //     ],
        //   },
        // ],
        copyright: `Copyright © ${new Date().getFullYear()} Andreas Hochsteger. Built with <a href="https://docusaurus.io/">Docusaurus</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '99BPL130HU',
      
        // Public API key: it is safe to commit it
        apiKey: '7e30d3d1c2592af9255ab489d6710dad',
      
        indexName: 'gmail-processor',
      
        // Optional: see doc section below
        contextualSearch: true,
      
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'ahochsteger\\.github\\.io/gmail-processor',
      
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
      
        // Optional: Algolia search parameters
        searchParameters: {},
      
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      
        //... other Algolia params
        ignoreCanonicalTo: true, // Fixes the problem of ignored pages due to wrong canonical URLs from Docusaurus
      },
    }),
};

module.exports = config;
