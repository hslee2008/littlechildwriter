import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: 'static',
  buildDir: 'nuxtbuild',
  head: {
    titleTemplate: 'Little 작가',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Little 작가에서 글을 올리고, 새롭게 배우고, 대화를 하세요.',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  generate: {
    fallback: '404.html',
  },

  vue: {
    config: {
      devtools: true,
      performance: true,
      productionTip: true,
    },
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
      theme_color: '#20232a',
      background_color: '#20232a',
      display: 'minimal-ui',
      scope: './',
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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    './assets/css/transition.css',
    './assets/css/component.css',
    './assets/css/global.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['./plugins/firebase.js', './plugins/vuetify.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyDI6kfyE4xQlPqD7Dem3OxiI9lhA4IxQ-I',
          authDomain: 'littlechildwriter.firebaseapp.com',
          projectId: 'littlechildwriter',
          storageBucket: 'littlechildwriter.appspot.com',
          messagingSenderId: '986081147205',
          appId: '1:986081147205:web:fadaee26490f1f173d662c',
          measurementId: 'G-F7Z7BLCQDQ',
        },
        services: {
          auth: true,
          database: true,
        },
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['./assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  content: ['./pages/*.vue'],

  config: {
    apiKey: 'AIzaSyDI6kfyE4xQlPqD7Dem3OxiI9lhA4IxQ-I',
    authDomain: 'littlechildwriter.firebaseapp.com',
    projectId: 'littlechildwriter',
    storageBucket: 'littlechildwriter.appspot.com',
    messagingSenderId: '986081147205',
    appId: '1:986081147205:web:fadaee26490f1f173d662c',
    measurementId: 'G-F7Z7BLCQDQ',
  },
}
