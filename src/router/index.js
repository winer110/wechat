import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 主界面
// const Home = r => require.ensure([], () => r(require('../views/Home.vue')), 'home')
const Home = resolve => require(['../views/Home.vue'], resolve)
// 关注界面
const Follow = r => require.ensure([], () => r(require('../views/Follow.vue')), 'view')
// 我的界面
const Mine = r => require.ensure([], () => r(require('../views/Mine.vue')), 'mine')
// 帮助界面
const Help = r => require.ensure([], () => r(require('../views/Help.vue')), 'help')
// 仪器详情
const Info = r => require.ensure([], () => r(require('../views/equipment/Info.vue')), 'help')
// 仪器预约界面
const Reserv = r => require.ensure([], () => r(require('../views/equipment/Reserv.vue')), 'view')
// 仪器送样界面
const Sample = r => require.ensure([], () => r(require('../views/equipment/Sample.vue')), 'view')
// 个人详情
const MyInfo = r => require.ensure([], () => r(require('../views/mine/Info.vue')), 'view')
// 我的预约
const MyReserv = r => require.ensure([], () => r(require('../views/mine/MyReserv.vue')), 'view')
// 我的送样
const MySample = r => require.ensure([], () => r(require('../views/mine/MySample.vue')), 'view')
// 送样详情
const SampleInfo = r => require.ensure([], () => r(require('../views/mine/sampleInfo.vue')), 'view')
// 我的使用记录
const MyUse = r => require.ensure([], () => r(require('../views/mine/MyUse.vue')), 'view')
// 注册
const Register = r => require.ensure([], () => r(require('../views/Register.vue')), 'view')

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/wechat/equipment/reserv/:id', name: 'equipment-reserv', component: Reserv },
    { path: '/wechat/equipment/sample/:id', name: 'equipment-sample', component: Sample },
    { path: '/wechat/equipment/:id', name: 'equipment-info', component: Info },
    { path: '/wechat/help', component: Help },
    { path: '/wechat/mine', component: Mine },
    { path: '/wechat/mine/info', component: MyInfo },
    { path: '/wechat/mine/reserv', component: MyReserv },
    { path: '/wechat/mine/sample', component: MySample },
    { path: '/wechat/mine/use', component: MyUse },
    { path: '/wechat/mine/sample/:id', name: 'SampleInfo', component: SampleInfo },
    { path: '/wechat/index', name: 'index', component: Home },
    { path: '/wechat/follow', component: Follow },
    { path: '/wechat/', redirect: '/wechat/index' },
    { path: '/', redirect: '/wechat/index' },
    { path: '/register', name: 'register', component: Register }
  ]
})
