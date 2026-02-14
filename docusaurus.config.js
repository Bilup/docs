/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'MistWarp Documentation',
  tagline: 'A comprehensive guide to MistWarp - the advanced Scratch modification platform',
  url: 'https://docs.warp.mistium.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  organizationName: 'MistWarp',
  projectName: 'docs',
  trailingSlash: false,
  themeConfig: {
    navbar: {
      title: 'MistWarp Documentation',
      logo: {
        alt: 'MistWarp Logo',
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
          href: 'https://warp.mistium.com/',
          label: 'MistWarp',
          position: 'right'
        },
        {
          href: 'https://github.com/MistWarp',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    algolia: {
      // This is all supposed to be public
      appId: 'HORQ9E5CCA',
      apiKey: 'c3873ce4208edb896a31bb3e7c2cbdad',
      indexName: 'mistwarp',
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
          editUrl: 'https://github.com/MistWarp/docs/edit/master/',
          breadcrumbs: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
