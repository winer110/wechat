// import Vue from 'vue'
import Api from '../api'

let api = new Api('follow')

const state = {
}

const actions = {
  FOLLOW_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  FETCH_FOLLOWS: ({state}, params) => {
    return api.fetch(params.token, params.start, params.step)
  }
}

const mutations = {
}

export default {
  state,
  actions,
  mutations
}
