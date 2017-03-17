import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex)

let queue = null
const store = new Vuex.Store({
  state: {
    currentUser: {
      'id': 1
    },
    equipments: [],
    items: {}
  },
  actions: {
    FETCH_USER: ({ commit, state }) => {
      let api = new Api('user')
      return Object.keys(state.currentUser).length > 0
        ? Promise.resolve(state.currentUser)
        : api.fetch().then(users => commit('SET_USER', { users }))
    },
    FETCH_EQUIPMENTS: (state, params) => {
      let api = new Api('equipments')
      return api.token().then(result => {
        return api.fetch(result.token, params.start, params.step)
      })
    },
    FETCH_EQUIPMENT: ({state, commit}, id) => {
      let api = new Api('equipments')
      return state.equipments[id]
        ? Promise.resolve(state.equipments[id])
        : api.get(id).then(equipment => commit('SET_EQUIPMENT', { equipment }))
    },
    FETCH_EQUIPMENT_QUEUE: ({state, commit}, item) => {
      commit('SET_EQUIPMENT_QUEUE', item)
    },
    FETCH_QUEUE: ({state, commit}) => {
      if (queue === null) {
        queue = () => {
          let api = new Api('equipments')
          let id = state.equipments[0].item.id
          state.equipments.shift()
          api.get(id).then(equipment => {
            commit('SET_EQUIPMENT', { equipment })
            if (state.equipments.length === 0) {
              queue = null
            } else {
              queue()
            }
          })
        }
        queue()
      }
    }
  },

  mutations: {
    SET_USER: (state, { users }) => {
      state.currentUser = users.values
    },

    SET_EQUIPMENT: (state, { equipment }) => {
      Vue.set(state.items, equipment)
    },

    SET_EQUIPMENT_QUEUE: (state, { item }) => {
      state.equipments.unshift(item)
      store.dispatch('FETCH_QUEUE')
    }
  }
})

export default store
