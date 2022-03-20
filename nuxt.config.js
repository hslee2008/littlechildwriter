export default {
  target: 'static',
  generate: {
    devtools: true,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'en,ko-kr',
    },
    titleTemplate: '%s',
    title: 'Little Child Writer',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'Learn programming through learning, practicing, and building. Our site includes full courses of python, c, c++, and rust for free in both Korean and English language.',
      },
      {
        name: 'author',
        content: ['Hyunseung'],
      },
      {
        name: 'copyright',
        content: 'LittleChildWriter',
      },
      {
        name: 'subtitle',
        content: '글을 올리고, 새롭게 배우고, 대화하기',
      },
      {
        name: 'subject',
        content: '글을 올리고, 새롭게 배우고, 대화하기',
      },
      {
        name: 'language',
        content: 'ES, KO-KR',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/favicon.ico',
      },
    ],
  },

  css: [
    '@/assets/css/global.css',
    '@/assets/css/transition.css',
    '@/assets/css/component.css',
  ],

  // https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vuetify.js'],

  // https://go.nuxtjs.dev/config-components
  components: true,

  components: {
    dirs: ['~/components/global/', '~/components/spec/'],
  },

  // https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/vuetify'],

  vue: {
    config: {
      devtools: true,
      performance: true,
      productionTip: true,
    },
  },

  //  https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  sitemap: {
    hostname: 'https://www.littlechildwriter.web.app',
    gzip: true,
    exclude: ['/.nuxt', '/404', '/500'],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
    },
  },

  robots: [
    {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://www.littlechildwriter.web.app/sitemap.xml',
    },
    {
      userAgent: 'Googlebot-image',
      Disallow: '/',
    },
  ],

  // https://go.nuxtjs.dev/config-axios
  axios: {
    // https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  loading: {
    color: 'skyblue',
    failedColor: 'red',
    height: '5px',
    continuous: true,
    throttle: 50,
    css: false,
  },
  loadingIndicator: {
    name: 'pulse',
    color: 'white',
    background: 'black',
  },

  //  https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Little 작가',
      short_name: 'Little 작가',
      version: '2022.02',
      description: 'Little 작가에서 글을 올리고, 새롭게 배우고, 대화하세요.',
      dir: 'rtl',
      id: '/index.html',
      author: ['이현승'],
      categories: ['Education', 'Programming'],
      theme_color: '#23272F',
      background_color: '#23272F',
      display: 'minimal-ui',
      scope: '/',
      start_url: '/',
      prefer_related_applications: false,
      related_applications: [
        {
          platform: 'webapp',
          url: 'https://littlechildwriter.web.app',
          id: 'com.LittleChildWriter.app',
        },
      ],
      orientation: 'portrait',
      icons: [
        {
          src: '/pwa/256x256.png',
          sizes: '256x256',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      screenshots: [
        {
          src: '/pwa/screenshot.png',
          sizes: '1920x896',
          type: 'image/png',
        },
      ],
      shortcuts: [
        {
          name: '홈',
          url: '/',
          description: '메인 페이지로 이동합니다.',
        },
        {
          name: '포스트',
          url: '/post',
          description: '글 올리기',
        },
        {
          name: '모든 글',
          url: '/list',
          description: '모든 글',
        },
      ],
    },
  },

  router: {
    base: '/',
  },

  vuetify: {
    customVariables: ['~/assets/sass/variables.scss'],
    treeShake: true,
  },

  //Configuration: https://go.nuxtjs.dev/config-build
  build: {
    devtools: true,
    optmizeCSS: true,
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },
    html: {
      minify: {
        collapseWhitespace: false,
        removeComments: true,
      },
    },
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.performance = {
          maxEntrypointSize: 512000,
          maxAssetSize: 512000,
        };
      }
    },
  },
};
