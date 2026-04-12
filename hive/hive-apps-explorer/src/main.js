import './assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import { vueDebounce } from 'vue-debounce'

createApp(App)
  .use(store)
  .use(router)
  .directive('debounce', vueDebounce({ lock: true }))
  .mount('#app')