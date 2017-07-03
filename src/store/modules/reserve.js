// import Vue from 'vue'
import Api from '../api'

let api = new Api('reserve')

const state = {
}

const actions = {
  RESERVE_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  RESERVE_LIST: ({ state }, params) => {
    return api.encall('list', params)
  },
  FETCH_RESERVE: (state, params) => {
    return api.fetch(params)
  },
  RESERVE_SERVER: (state, params) => {
    return api.get(params)
  }
}

const mutations = {
}

export default {
  state,
  actions,
  mutations
}
