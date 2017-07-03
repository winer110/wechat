// import Vue from 'vue'
import Api from '../api'

let api = new Api('wechat')

const state = {
  info: {}
}

const actions = {
  UNION_ID: ({ state, commit }) => {
    Object.keys(state.info).length > 0
      ? Promise.resolve(state.info)
      : api.fetch().then(info => {
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
