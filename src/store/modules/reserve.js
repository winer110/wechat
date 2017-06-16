// import Vue from 'vue'
import Api from '../api'

let api = new Api('reserve')

const state = {
}

const actions = {
  FETCH_RESERVE: (state, params) => {
    return api.fetch(params)
  }
}

const mutations = {
}

export default {
  state,
  actions,
  mutations
}
