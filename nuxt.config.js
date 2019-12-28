import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'
import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: ['firebaseui/dist/firebaseui.css'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/firebase',
    {
      src: '@/plugins/vue-chartjs',
      ssr: false,
    },
    {
      src: '~/plugins/vue-full-calendar',
      ssr: false,
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
  ],
  router: {
    routes: [
      {
        name: 'index',
        path: '/',
        component: 'pages/index.vue'
      },
      {
      name: 'questions-id',
      path: '/questions/:id?',
      component: 'pages/questions/_id.vue'
      },
      {
      name: 'analytics-id',
      path: '/analytics/:id?',
      component: 'pages/analytics/_id.vue'
      },
    ],
    middleware: ['auth']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    dark: true,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    },
    customVariables: ['~/assets/variables.scss']
  },
  /*
  ** Build configuration
  */
  build: {
    extend (config, ctx) {
    }
  }
}
