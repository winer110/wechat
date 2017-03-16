import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: {},
    equipments: {}
  },

  actions: {
    FETCH_USER: ({ commit, state }) => {
      let api = new Api('user')
      return Object.keys(state.currentUser).length > 0
        ? Promise.resolve(state.currentUser)
        : api.fetch().then(users => commit('SET_USER', { users }))
    },
    FETCH_EQUIPMENT: ({ commit, state }, params) => {
      let api = new Api('equipments')
      return Object.keys(state.equipments).length > 0
        ? Promise.resolve(state.equipments)
        : api.fetch(params).then(equipments => commit('SET_EQUIPMENT', { equipments }))
    }
  },

  mutations: {
    SET_USER: (state, { users }) => {
      state.currentUser = users.values
    },

    SET_EQUIPMENT: (state, { equipments }) => {
      state.equipments = equipments
    }
  },

  getters: {
  }
})

export default store
