// import Vue from 'vue'
import Api from '../api'

let api = new Api('user')

const state = {
  user: {}
}

const actions = {
  FETCH_USER: ({ state, commit }) => {
    let params = 'o_UpduMUIn7STnCe9vpZ8EfVqlIg'
    Object.keys(state.user).length > 0
      ? Promise.resolve(state.user)
      : api.fetch(params).then(users => {
        commit('setUser', users.result)
      })
  }
}

const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export default {
  state,
  actions,
  mutations
}
