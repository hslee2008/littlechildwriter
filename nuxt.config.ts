import vuetify from 'vite-plugin-vuetify'
import { getRoutes } from './firebase/routes'

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
          content: '#23262E'
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
  plugins: ['/plugins/firebase'],
  modules: [
    (
      _: any,
      nuxt: {
        hooks: { hook: (arg0: string, arg1: (config: any) => any) => void }
      }
    ) => {
      nuxt.hooks.hook('vite:extendConfig', (config: any) =>
        config.plugins.push(
          vuetify({
            styles: {
              configFile: 'assets/scss/vuetify.scss'
            }
          })
        )
      )
    },
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore']
      }
    ],
    '@kevinmarrec/nuxt-pwa',
    '@vueuse/nuxt',
    'nuxt-gtag'
  ],

  pwa: {
    manifest: {
      name: 'Little 작가',
      short_name: 'Little 작가',
      description:
        'Little 작가는 글을 올리고, 새롭게 배우고, 대화하기 위한 플랫폼입니다.',
      lang: 'ko',
      display: 'standalone',
      background_color: '#23262E',
      theme_color: '#23262E',
      start_url: '/',
      icons: []
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
    async 'nitro:config'(config: { prerender: { routes: any[] } }) {
      config?.prerender?.routes?.push(...(await getRoutes()))
    }
  },

  sourcemap: {
    server: false,
    client: false
  },

  experimental: {
    payloadExtraction: true,
    viewTransition: true,
    typedPages: true
  },

  gtag: {
    id: 'G-F7Z7BLCQDQ'
  }
})
