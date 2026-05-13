/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Bilup Documentation',
  tagline: 'A comprehensive guide to Bilup - the advanced Scratch modification platform',
  url: 'https://docs.bilup.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'favicon.ico',
  organizationName: 'Bilup',
  projectName: 'docs',
  trailingSlash: false,
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-CN': {
        label: '中文',
      },
    },
  },
  themeConfig: {
    navbar: {
      title: 'Bilup Documentation',
      logo: {
        alt: 'Bilup Logo',
        src: 'favicon.ico',
      },
      items: [
        {
          to: '/getting-started/',
          label: 'Getting Started',
          position: 'left'
        },
        {
          to: '/development/',
          label: 'Development',
          position: 'left'
        },
        {
          to: '/gui-internals/',
          label: 'GUI Internals',
          position: 'left'
        },
        {
          to: '/packager/',
          label: 'Packager',
          position: 'left'
        },
        {
          to: '/api-reference/',
          label: 'API Reference',
          position: 'left'
        },
        {
          href: 'https://editor.bilup.org/',
          label: 'Bilup',
          position: 'right'
        },
        {
          href: 'https://github.com/Bilup',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    algolia: {
      container: '#docsearch',
      appId: 'I0GSY4KZL0',
      indexName: 'Bilup Docs',
      apiKey: '125afb092032b2e4944f1f2090a3c58a'
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('./code-themes/light'),
      darkTheme: require('./code-themes/dark'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/Bilup/docs/edit/main/',
          breadcrumbs: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};