/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1565C0',
          secondary: '#0D47A1',
          accent: '#42A5F5',
          success: '#2E7D32',
          warning: '#EF6C00',
          error: '#C62828',
          info: '#0277BD',
          surface: '#FFFFFF',
          background: '#F5F7FA',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-surface': '#1A2332',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      textTransform: 'none',
    },
    VContainer: {
      fluid: true,
      elevation: 1,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VDialog: {
      rounded: 'xl',
    },
    VTable: {
      density: 'comfortable',
    },
  },
})
