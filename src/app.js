import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import Axios from 'axios'

// import Mint from 'mint-ui'

// const inBrowser = !!(
//   typeof window !== 'undefined' &&
//   window.document &&
//   window.document.createElement
// )

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// 类似于vue-resource的调用方法 之后可以在实例中直接用 this.$http.get()等
Vue.prototype.$http = Axios
// Vue.use(resource)

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
  router,
  store,
  ...App
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store }
