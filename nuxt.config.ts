import vuetify from 'vite-plugin-vuetify'
import { getRoutes } from './firebase/routes.ts'

export default defineNuxtConfig({
  imports: {
    dirs: ['stores']
  },

  app: {
    keepalive: true,
    head: {
      titleTemplate: '%s',
      title: 'Little 작가',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Learn to write with Little 작가. Little 작가 is a writing platform for kids to learn to write.'
        },
        {
          name: 'author',
          content: ['Hyunseung', 'Juha Im', 'Jinwon Kim']
        },
        {
          name: 'copyright',
          content: 'LCW'
        },
        {
          name: 'subtitle',
          content: '글을 올리고, 새롭게 배우고, 대화하기'
        },
        {
          name: 'subject',
          content: '글을 올리고, 새롭게 배우고, 대화하기'
        },
        {
          name: 'language',
          content: 'ES, KO-KR'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          charset: 'utf-8'
        },
        {
          name: 'theme-color',
          content: '#159ECB'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon.ico'
        }
      ],
      noscript: [
        {
          children: 'This website requires JavaScript'
        }
      ]
    }
  },

  typescript: {
    strict: true,
    shim: false
  },

  ssr: false,

  css: [
    '/assets/css/global.css',
    '/assets/css/custom.css',
    '/assets/css/vuetify.css',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  plugins: ['/plugins/firebase', 'plugins/gtag'],
  modules: [
    (_, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config =>
        config.plugins.push(vuetify())
      )
    },
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore']
      }
    ],
    '@kevinmarrec/nuxt-pwa',
    '@vueuse/nuxt'
  ],

  pwa: {
    meta: {
      theme_color: '#159ECB',
      mobileAppIOS: true
    },
    workbox: {
      enabled: true
    }
  },

  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },

  build: {
    transpile: ['vuetify']
  },

  hooks: {
    async 'nitro:config'(config) {
      config?.prerender?.routes?.push(...(await getRoutes()))
    }
  },

  experimental: {
    payloadExtraction: true
  }
})
