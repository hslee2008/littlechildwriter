import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '../assets/scss/vuetify.scss'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#159ECB',
            secondary: '#b0bec5',
            info: '#2196F3',
            accent: '#293540',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#b71c1c',
            background: '#23262E'
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
