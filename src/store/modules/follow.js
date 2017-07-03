// import Vue from 'vue'
import Api from '../api'

let api = new Api('follow')

const state = {
}

const actions = {
  FOLLOW_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  FETCH_FOLLOWS: ({ state }, params) => {
    return api.fetch(params.token, params.start, params.step)
  },
  CHANGE_FOLLOWS: ({ state }, params) => {
    return !params.isfollow ? api.add(params.gapperid, params.sourceName, params.uuid) : api.delete(params.gapperid, params.sourceName, params.uuid)
  },
  JUDGE_FOCUS: ({ state }, params) => {
    return api.patch(params.gapperid, params.sourceName, params.uuid)
  }
}

const mutations = {
}

export default {
  state,
  actions,
  mutations
}
