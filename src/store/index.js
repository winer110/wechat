import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: {
      'id': 1
    },
    equipments: {}
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
    }
  },

  mutations: {
    SET_USER: (state, { users }) => {
      state.currentUser = users.values
    },

    SET_EQUIPMENT: (state, { equipment }) => {
      Vue.set(state.equipments, equipment.id, equipment)
    }
  }
})

export default store
