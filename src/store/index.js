import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex)

let queue = null

const store = new Vuex.Store({
  state: {
    currentUser: {},
    equipments: [],
    items: {},
    token: {},
    code: ''
  },
  actions: {
    FETCH_FOLLOWS: ({state, commit}, params) => {
      // let api = new Api('follow')
      // return
    },
    FETCH_CODE: ({ commit, state }) => {
      console.log('hello')
    },
    FETCH_USER: ({ commit, state }) => {
      let api = new Api('user')
      return state.currentUser
        ? Promise.resolve(state.currentUser)
        : api.fetch('o_UpduMUIn7STnCe9vpZ8EfVqlIg').then(users => {
          commit('SET_USER', { users })
        })
    },
    FETCH_EQUIPMENTS: ({state, commit}, params) => {
      let api = new Api('equipments')
      if (!state.token.result) {
        return api.token().then(result => {
          commit('SET_TOKEN', { result })
          return api.fetch(result.token, params.start, params.step)
        })
      } else {
        return api.fetch(state.token.result.token, params.start, params.step)
      }
    },
    FETCH_EQUIPMENT: ({state, commit}, id) => {
      let api = new Api('equipments')
      if (state.items[id]) {
        return Promise.resolve(state.items[id])
      } else {
        return api.get(id).then(equipment => {
          let single = 1
          equipment = equipment.result
          state.equipments.splice(0, state.equipments.length)
          commit('SET_EQUIPMENT', { equipment, id, single })
          return equipment
        })
      }
    },
    FETCH_EQUIPMENT_QUEUE: ({state, commit}, item) => {
      if (state.items[item.id]) {
        item.item.getInfo(state.items[item.id])
      } else {
        commit('SET_EQUIPMENT_QUEUE', item)
      }
    },
    FETCH_QUEUE: ({state, commit}) => {
      if (queue === null) {
        queue = () => {
          let api = new Api('equipments')
          let id = state.equipments[0].item.id
          api.get(id).then(equipment => {
            let single = 0
            equipment = equipment.result
            commit('SET_EQUIPMENT', { equipment, id, single })
            if (state.equipments.length === 0) {
              queue = null
            } else {
              queue()
            }
          })
        }
        queue()
      }
    },
    FETCH_STATUS: (state, user, id) => {
      let api = new Api('equipments')
      return api.status(user, id)
    },
    FECTH_RESERVES: (state, params) => {
      let api = new Api('reserve')
      return api.fetch(params).then(res => {
        console.log(res)
      })
    }
  },

  mutations: {
    SET_USER: (state, users) => {
      state.currentUser = users.result
    },

    SET_CODE: (state, code) => {
      state.code = code
    },

    SET_EQUIPMENT: (state, { equipment, id, single }) => {
      Vue.set(state.items, id, equipment)
      if (!single && state.equipments.length > 0) {
        let emitVm = state.equipments.shift()
        emitVm.getInfo(equipment)
      }
    },

    SET_EQUIPMENT_QUEUE: (state, { item }) => {
      state.equipments.push(item)
      store.dispatch('FETCH_QUEUE')
    },

    SET_TOKEN: (state, token) => {
      state.token = token
    }
  }
})

export default store
