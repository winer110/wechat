// import Vue from 'vue'
import Api from '../api'

let api = new Api('billing')

const state = {
  info: {}
}

const actions = {
  FETCH_COUNTINFO: ({ state, commit }, params) => {
    Object.keys(state.info).length > 0
      ? Promise.resolve(state.info)
      : api.fetch(params).then(info => {
        commit('setInfo', info)
      })
  }
}

const mutations = {
  setInfo (state, info) {
    state.info = info
  }
}

export default {
  state,
  actions,
  mutations
}
