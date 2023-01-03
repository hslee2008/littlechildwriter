import vuetify from 'vite-plugin-vuetify'

async function getRoutes() {
  const routes = [] as string[]
  const admin = require('firebase-admin')
  const serviceAccount = require('./firebase/littlechildwriter-firebase-adminsdk-nzz0v-a45c9692df.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://littlechildwriter-default-rtdb.firebaseio.com'
  })

  const db = admin.database()

  const books = (await db.ref('contents').once('value')).val()
  const classes = (await db.ref('classes').once('value')).val()
  const teams = (await db.ref('teams').once('value')).val()
  const users = (await db.ref('users').once('value')).val()
  const debate = (await db.ref('debate').once('value')).val()
  const blog = (await db.ref('blog').once('value')).val()

  for (const r in books) routes.push(`/book/content/${r}`)
  for (const r in classes) routes.push(`/class/${r}`)
  for (const r in teams) routes.push(`/team/about/${r}`)
  for (const r in users) routes.push(`/user/${r}`)
  for (const r in debate) routes.push(`/debate/topic/${r}`)
  for (const r in blog) routes.push(`/blog/content/${r}`)

  return routes
}

export default defineNuxtConfig({
  alias: {
    tslib: 'tslib/tslib.es6.js',
    plugins: '@/plugins',
    assets: '@/assets'
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
          children: 'This website requires JavaScript.'
        }
      ]
    }
  },

  typescript: {
    strict: true,
    shim: false
  },

  ssr: false,

  loadingIndicator: {
    name: 'three-bounce',
    color: '#D3D3D3',
    background: '#23262E'
  },

  css: [
    'assets/css/global.css',
    'assets/sass/global.scss',
    'vuetify/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  plugins: ['plugins/firebase', 'plugins/gtag'],
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config =>
        config.plugins.push(vuetify())
      )
    },
    '@kevinmarrec/nuxt-pwa'
  ],
  target: 'static',

  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },

  pwa: {
    manifest: {
      short_name: 'LCW',
      name: 'Little Child Writer',
      icons: [
        {
          src: '/pwa/512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa/256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/pwa/192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa/144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/pwa/96x96.png',
          sizes: '96x96',
          type: 'image/png'
        }
      ],
      screenshots: [
        {
          src: '/pwa/books.jpg',
          type: 'image/png',
          sizes: '1600x789'
        }
      ],
      start_url: '/',
      background_color: '#1B1B1D',
      display: 'browser',
      display_override: ['fullscreen', 'minimal-ui'],
      scope: '/',
      theme_color: '#1B1B1D',
      description: 'Learn, Practice, Build and Deploy',
      categories: ['Education', 'Books', 'Library'],
      author: ['Hyunseung Lee', 'Juha Im', 'Jiwon Kim'],
      orientation: 'portrait',
      dir: 'ltr',
      lang: 'en-US'
    }
  },

  build: {
    transpile: ['vuetify']
  },

  vuetify: {
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#159ECB',
          secondary: '#b0bec5',
          info: '#2196F3',
          accent: '#293540',
          success: '#4CAF50',
          warning: '#FFC107',
          error: '#b71c1c'
        },
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      },
      options: {
        themeCache: {
          get: key => localStorage.getItem(key),
          set: (key, value) => localStorage.setItem(key, value)
        }
      }
    }
  },

  vue: {
    config: {
      productionTip: true,
      devtools: true,
      silent: false,
      performance: true
    }
  },

  router: {
    base: '/'
  },

  hooks: {
    async 'nitro:config'(config) {
      config?.prerender?.routes?.push(...(await getRoutes()))
    }
  },

  googleAnalytics: {
    id: 'G-F7Z7BLCQDQyy'
  }
})
