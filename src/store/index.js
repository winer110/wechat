import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import equipment from './modules/equipment'
import follow from './modules/follow'
import reserve from './modules/reserve'
import billing from './modules/billing'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    equipment,
    follow,
    reserve,
    billing
  }
})

// import Vue from 'vue'
// import Vuex from 'vuex'
// import Api from './api'
// import io from 'socket.io-client'

// Vue.use(Vuex)

// let queue = null
// let proxyUrl = 'http://proxy.17kong.com/'

// const store = new Vuex.Store({
//   state: {
//     currentUser: {},
//     equipments: [],
//     items: {},
//     token: {},
//     code: '',
//     socket: ''
//   },
//   actions: {
//     FETCH_FOLLOWS: ({state, commit}, params) => {
//       let api = new Api('user')
//       return api.call('follow', params)
//     },
//     FETCH_FOLLOWS_EQUIPMENTS: ({state}, params) => {
//       let api = new Api('user')
//       return api.call('equipments', params.token, params.start, params.step)
//     },
//     GET_EQUIPMENT: ({state}, params) => {
//       let api = new Api('equipments')
//       return api.call('equipment', params)
//     },
//     FETCH_CODE: ({ commit, state }) => {
//       console.log('hello')
//     },
//     FETCH_USER: ({ commit, state }) => {
//       let api = new Api('user')
//       return state.currentUser
//         ? Promise.resolve(state.currentUser)
//         : api.fetch('o_UpduMUIn7STnCe9vpZ8EfVqlIg').then(users => {
//           commit('SET_USER', { users })
//         })
//     },
//     FETCH_EQUIPMENTS: ({state, commit}, params) => {
//       let api = new Api('equipments')
//       return api.fetch(params.token, params.start, params.step)
//       // if (!state.token.result) {
//       //   return api.token().then(result => {
//       //     commit('SET_TOKEN', { result })
//       //     return api.fetch(result.token, params.start, params.step)
//       //   })
//       // } else {
//       //   return api.fetch(state.token.result.token, params.start, params.step)
//       // }
//     },
//     FETCH_EQUIPMENT: ({state, commit}, id) => {
//       let api = new Api('equipments')
//       if (state.items[id]) {
//         return Promise.resolve(state.items[id])
//       } else {
//         return api.get(id).then(equipment => {
//           let single = 1
//           equipment = equipment.result
//           state.equipments.splice(0, state.equipments.length)
//           commit('SET_EQUIPMENT', { equipment, id, single })
//           return equipment
//         })
//       }
//     },
//     FETCH_EQUIPMENT_QUEUE: ({state, commit}, item) => {
//       if (state.items[item.id]) {
//         item.item.getInfo(state.items[item.id])
//       } else {
//         commit('SET_EQUIPMENT_QUEUE', item)
//       }
//     },
//     FETCH_QUEUE: ({state, commit}) => {
//       if (queue === null) {
//         queue = () => {
//           let api = new Api('equipments')
//           let id = state.equipments[0].item.id
//           api.get(id).then(equipment => {
//             let single = 0
//             equipment = equipment.result
//             commit('SET_EQUIPMENT', { equipment, id, single })
//             if (state.equipments.length === 0) {
//               queue = null
//             } else {
//               queue()
//             }
//           })
//         }
//         queue()
//       }
//     },
//     FETCH_STATUS: (state, user, id) => {
//       let api = new Api('equipments')
//       return api.status(user, id)
//     },
//     FECTH_RESERVES: (state, params) => {
//       let api = new Api('reserve')
//       return api.fetch(params).then(res => {
//         return res
//       })
//     },
//     FETCH_SOCKET: ({ state }, id) => {
//       console.log('hello')
//       let auth = 1
//       state.socket = io.connect(state.items[id].socket_url, {
//         path: '/scoket.io',
//         autoConnect: false,
//         forceNew: true,
//         timeout: 10000
//       })
//       let validationMessage = {
//         id: state.currentUser.id,
//         email: state.currentUser.email
//       }
//       let handlerListen = msg => {
//         state.socket.emit('auth', { form: JSON.stringify(validationMessage) })
//       }
//       state.socket.connect().on('connect', handlerListen)
//       .on('connect_error', msg => {
//         // 需要走代理服务
//         console.log('failed')
//         state.socket.disconnect()
//         if (auth) {
//           auth = 0
//           state.scoket = io.connect(proxyUrl, {
//             path: 'socket.io',
//             autoConnect: false,
//             forceNew: true,
//             timeout: 10000
//           })
//           validationMessage.source_name = state.items[id].source_name
//           validationMessage.socket = {}
//           state.socket.connect().on('connect', handlerListen)
//           .on('connect_error', msg => {
//             console.log('connecc failed')
//             state.socket.disconnect()
//           })
//         }
//         return Promise.resolve(state.scoket)
//       })
//       return Promise.resolve(state.scoket)
//     }
//   },

//   mutations: {
//     SET_USER: (state, users) => {
//       state.currentUser = users.result
//     },

//     SET_CODE: (state, code) => {
//       state.code = code
//     },

//     SET_EQUIPMENT: (state, { equipment, id, single }) => {
//       Vue.set(state.items, id, equipment)
//       if (!single && state.equipments.length > 0) {
//         let emitVm = state.equipments.shift()
//         emitVm.getInfo(equipment)
//       }
//     },

//     SET_EQUIPMENT_QUEUE: (state, { item }) => {
//       state.equipments.push(item)
//       store.dispatch('FETCH_QUEUE')
//     },

//     SET_TOKEN: (state, token) => {
//       state.token = token
//     }
//   }
// })
