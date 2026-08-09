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
  clientModules: [
    require.resolve('./src/clientModules/spotlight-key.js'),
    require.resolve('./src/clientModules/sidebar-toggle.js'),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN', 'zh-TW'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-CN': {
        label: '简体中文',
      },
      'zh-TW': {
        label: '繁體中文',
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
          type: 'dropdown',
          label: 'Use Bilup',
          position: 'left',
          items: [
            {to: '/getting-started/introduction', label: 'Getting Started'},
            {to: '/editor/interface', label: 'Using the Editor'},
            {to: '/blocks/overview', label: 'Blocks Reference'},
            {to: '/extensions/overview', label: 'Extensions'},
            {to: '/advanced/cloud-variables', label: 'Advanced Features'}
          ]
        },
        {
          type: 'dropdown',
          label: 'Build & Extend',
          position: 'left',
          items: [
            {to: '/building-extensions/introduction', label: 'Building Extensions'},
            {to: '/packager/overview', label: 'Packager'},
            {to: '/api-reference/overview', label: 'API Reference'}
          ]
        },
        {
          type: 'dropdown',
          label: 'Contribute',
          position: 'left',
          items: [
            {to: '/contributing/overview', label: 'Contributing'},
            {to: '/internals/overview', label: 'Architecture & Internals'}
          ]
        },
        {
          href: 'https://com.bilup.org/',
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
      appId: '90B9X0B5K5',
      indexName: 'Bilup Documentation Crawler',
      apiKey: '2e6593daef4974ad3d144ebd2fdf488f'
    },
    colorMode: {
      // The editor syncs the docs to its own theme, so no in-page toggle.
      disableSwitch: true,
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
