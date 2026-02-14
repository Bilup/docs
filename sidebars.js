module.exports = {
  // Main sidebar with all sections organized
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/migrating-from-scratch'
      ]
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: true,
      items: [
        'development/home',
        'development/getting-started',
        'development/first-steps',
        'development/project-structure',
        'development/building-running',
        'development/testing',
        'development/contributing',
        'development/deploying',
        'development/globals',
        'development/scratchx',
        {
          type: 'category',
          label: 'Components',
          collapsed: true,
          items: [
            {
              type: 'category',
              label: 'Extensions Library',
              collapsed: true,
              items: [
                'development/components/extensions-library/overview',
                'development/components/extensions-library/adding-tags'
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Extensions',
      collapsed: true,
      items: [
        'extensions/introduction',
        'extensions/hello-world',
        'extensions/inputs',
        'extensions/async',
        'extensions/sandbox',
        'extensions/unsandboxed',
        'extensions/better-development-server',
        'extensions/assorted-apis',
        'extensions/hats',
        'extensions/compatibility',
        'extensions/share',
        'extensions/docsURI-demo',
        'extensions/wrapping-up',
        'extensions/custom-c-blocks',
        'extensions/advanced-block-customization',
        {
          type: 'category',
          label: 'APIs',
          collapsed: true,
          items: [
            {
              type: 'category',
              label: 'Renderer',
              collapsed: true,
              items: [
                'extensions/apis/renderer-api',
                'extensions/apis/renderer/createBitmapSkin',
                'extensions/apis/renderer/createDrawable',
                'extensions/apis/renderer/createPenSkin',
                'extensions/apis/renderer/createSVGSkin',
                'extensions/apis/renderer/createTextSkin',
                'extensions/apis/renderer/destroyDrawable',
                'extensions/apis/renderer/destroySkin',
                'extensions/apis/renderer/draw',
                'extensions/apis/renderer/getBounds',
                'extensions/apis/renderer/getBoundsForBubble',
                'extensions/apis/renderer/getCurrentSkinSize',
                'extensions/apis/renderer/getDrawableOrder',
                'extensions/apis/renderer/getSkinRotationCenter',
                'extensions/apis/renderer/getSkinSize',
                'extensions/apis/renderer/isTouchingColor',
                'extensions/apis/renderer/isTouchingDrawables',
                'extensions/apis/renderer/markSkinAsPrivate',
                'extensions/apis/renderer/requestSnapshot',
                'extensions/apis/renderer/resize',
                'extensions/apis/renderer/setBackgroundColor',
                'extensions/apis/renderer/setDrawableOrder',
                'extensions/apis/renderer/setStageSize',
                'extensions/apis/renderer/updateBitmapSkin',
                'extensions/apis/renderer/updateDrawableProperties',
                'extensions/apis/renderer/updateSVGSkin',
                'extensions/apis/renderer/updateTextSkin'
              ]
            },
            'extensions/apis/audio-api',
            'extensions/apis/scratch-api',
            'extensions/apis/utility-apis',
          ]
        },
        {
          type: 'category',
          label: 'Compiled Extensions',
          collapsed: true,
          items: [
            'extensions/compiled-extensions/overview',
            'extensions/compiled-extensions/structure',
            'extensions/compiled-extensions/patching',
            'extensions/compiled-extensions/first-extension',
            'extensions/compiled-extensions/advanced'
          ]
        },
      ]
    },
    {
      type: 'category',
      label: 'GUI Internals',
      collapsed: true,
      items: [
        'gui-internals/home',
        'gui-internals/architecture',
        {
          type: 'category',
          label: 'Addons',
          collapsed: true,
          items: [
            'gui-internals/addons/home',
          ]
        },
        {
          type: 'category',
          label: 'Core Components',
          collapsed: true,
          items: [
            'gui-internals/components/gui-component',
            'gui-internals/components/menu-bar',
            'gui-internals/components/blocks',
            'gui-internals/components/stage',
            'gui-internals/components/sprite-selector',
            'gui-internals/components/sound-tab',
            'gui-internals/components/costume-tab',
            'gui-internals/components/modals'
          ]
        },
        {
          type: 'category',
          label: 'Containers',
          collapsed: true,
          items: [
            'gui-internals/containers/overview',
            'gui-internals/containers/gui-container'
          ]
        },
        {
          type: 'category',
          label: 'State Management',
          collapsed: true,
          items: [
            'gui-internals/state/home',
            'gui-internals/state/reducers',
            'gui-internals/state/selectors',
            'gui-internals/state/middleware',
            'gui-internals/state/debugging'
          ]
        },
        {
          type: 'category',
          label: 'Theming & Styling',
          collapsed: true,
          items: [
            'gui-internals/theming/home',
            'gui-internals/theming/accent-colors',
            'gui-internals/theming/gui-themes',
            'gui-internals/theming/block-themes'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Packager',
      collapsed: true,
      items: [
        'packager/home',
        'packager/embedding',
        'packager/commercial-use',
        'packager/dynamic-stage-resize',
        'packager/special-cloud-behaviors',
        'packager/offline'
      ]
    },
    {
      type: 'category',
      label: 'Website Features',
      collapsed: true,
      items: [
        'website/how-it-works',
        'website/embedding',
        'website/javascript',
        'website/turbowarp-blocks',
        'website/url-parameters',
        'website/cloud-variables',
        'website/unshared-projects',
        'website/scratch-accounts',
        'website/cors',
        'website/translate',
        'website/4.4',
        'website/donate',
        'website/return',
        {
          type: 'category',
          label: 'Settings',
          collapsed: true,
          items: [
            'website/settings/overview',
            'website/settings/custom-stage-size',
            'website/settings/custom-fps',
            'website/settings/infinite-clones',
            'website/settings/remove-fencing',
            'website/settings/high-quality-pen',
            'website/settings/interpolation',
            'website/settings/disable-compiler',
            'website/settings/warp-timer',
            'website/settings/remove-misc-limits'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api-reference/home',
        'api-reference/gui-api',
        'api-reference/vm-api',
        'api-reference/extension-api',
        'api-reference/block-registration',
        'api-reference/threads',
        'api-reference/addon-api',
        'api-reference/events',
        'api-reference/utilities'
      ]
    }
  ]
};
