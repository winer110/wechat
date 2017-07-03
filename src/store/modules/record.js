// import Vue from 'vue'
import Api from '../api'

let api = new Api('record')

const actions = {
  RECORD_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  RECORD_LIST: ({ state }, params) => {
    return api.encall('list', params)
  }
}

const mutations = {
}

export default {
  actions,
  mutations
}
