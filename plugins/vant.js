import Vue from 'vue'
import Vant, { Locale } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'

Locale.use('en-US', enUS)
// import '@vant/touch-emulator'

Vue.use(Vant)
