import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api'

Vue.use(Vuex)

let queue = null

const store = new Vuex.Store({
  state: {
    currentUser: {},
    equipments: [],
    items: {}
  },
  actions: {
    FETCH_USER: ({ commit, state }) => {
      let api = new Api('user')
      return state.currentUser
        ? Promise.resolve(state.currentUser)
        : api.fetch('o_UpduMUIn7STnCe9vpZ8EfVqlIg').then(users => commit('SET_USER', { users }))
    },
    FETCH_EQUIPMENTS: (state, params) => {
      let api = new Api('equipments')
      return api.token().then(result => {
        return api.fetch(result.token, params.start, params.step)
      })
    },
    FETCH_EQUIPMENT: ({state, commit}, id) => {
      let api = new Api('equipments')
      return state.items[id]
        ? Promise.resolve(state.items[id])
        : api.get(id).then(equipment => commit('SET_EQUIPMENT', { equipment }))
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
            commit('SET_EQUIPMENT', {equipment, id})
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
      state.currentUser = users
    },

    SET_EQUIPMENT: (state, { equipment, id }) => {
      Vue.set(state.items, id, equipment)
      let emitVm = state.equipments.shift()
      emitVm.getInfo(equipment)
    },

    SET_EQUIPMENT_QUEUE: (state, { item }) => {
      state.equipments.push(item)
      store.dispatch('FETCH_QUEUE')
    }
  }
})

export default store
