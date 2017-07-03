import Vue from 'vue'
import Api from '../api'

let api = new Api('equipment')

const state = {
  equipment: {},
  uuidToID: {}
}

const actions = {
  EQ_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  EQ_LIST: ({ state }, params) => {
    return api.fetch(params.token, params.start, params.step)
  },
  FETCH_EQUIPMENT: ({ state, commit }, id) => {
    return state.equipment[id]
      ? Promise.resolve(state.equipment[id])
      : api.call('get', {
        params: id,
        commit,
        type: 'setEQ'
      })
  },
  FETCH_FOLLOW_EQUIPMENT: ({ state, commit }, uuid) => {
    // return state.equipment[uuid]
    //   ? Promise.resolve(state.equipment[uuid])
    //   : api.get(uuid)
    return state.equipment[uuid]
      ? Promise.resolve(state.equipment[uuid])
      : api.call('get', {
        params: uuid,
        commit,
        type: 'setEQ_UUID'
      })
  }
}

const mutations = {
  setEQ (state, { type, result }) {
    if (!result.icon) {
      result.icon = '/public/img/equipment/default.png'
    }
    Vue.set(state.equipment, result.id, result)
    Vue.set(state.uuidToID, result.uuid, result.id)
  },
  setEQ_UUID (state, { type, result }) {
    if (!result.icon) {
      result.icon = '/public/img/equipment/default.png'
    }
    Vue.set(state.equipment, result.uuid, result)
  }
}

export default {
  state,
  actions,
  mutations
}
