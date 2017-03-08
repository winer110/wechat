import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Help from '../views/Help.vue'
import Mine from '../views/Mine.vue'
import Home from '../views/Home.vue'
import Follow from '../views/Follow.vue'
import Info from '../views/equipment/Info.vue'
import Reserv from '../views/equipment/Reserv.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/wechat/equipment/reserv/:id', name: 'equipment-reserv', component: Reserv },
    { path: '/wechat/equipment/:id', name: 'equipment-info', component: Info },
    { path: '/wechat/help', component: Help },
    { path: '/wechat/mine', component: Mine },
    { path: '/wechat/index', component: Home },
    { path: '/wechat/follow', component: Follow },
    { path: '/wechat/', redirect: '/wechat/index' },
    { path: '/', redirect: '/wechat/index' }
  ]
})
