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
  },
  ADD_USER: (state, params) => {
    return api.add(params)
  },

  LINK_WECHAT: (state, params) => {
    return api.patch(params.email, params.openid)
  },

  LINK_IDENTITY: (state, params) => {
    return api.delete(params.gapperid, params.wechat, params.unionid)
  },

  ADD_GAPPER: (state, params) => {
    return api.encall('addGapper', params)
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
