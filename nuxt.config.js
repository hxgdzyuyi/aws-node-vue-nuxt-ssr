module.exports = {
  mode: 'universal',

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['vant/lib/index.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/antd-ui',
    { src: '~/plugins/vant', ssr: true },
    { src: '~/plugins/vuex-persist', ssr: false }
  ],

  modules: [
    '@nuxtjs/axios',
    //'@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    ['vue-scrollto/nuxt', { duration: 300 }]
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'https://am2.archya.com/graphql'
      }
    }
  },

  render: {
    compressor: false,
  },
};
