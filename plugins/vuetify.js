import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#087EA4',
        secondary: '#b0bec5',
        info: '#2196F3',
        accent: '#293540',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#b71c1c',
      },
      light: {
        primary: '#087EA4',
        secondary: '#b0bec5',
        info: '#2196F3',
        accent: '#E6F7FF',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#b71c1c',
      },
    },
  },
});
