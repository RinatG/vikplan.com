import Vue from 'vue'
import Router from 'vue-router'
//import axios from 'axios'
import Meta from 'vue-meta'

import App from './App.vue'
import { routes } from './routes'
import { store } from './store/index'
import './filters'

// Convenience item - this.$http
//Vue.prototype.$http = axios
Vue.prototype.$gtag = 'G-6YE4S96F30';
Vue.prototype.$baseUrl = "https://vikplan2.ru";
Vue.use(Router)
Vue.use(Meta)

// Setting up routes
const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.afterEach((to, from) => {
  store.commit('nav/closeSideNav')
})

// Instantiation
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
