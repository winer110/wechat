import Vue from 'vue'
import Api from '../api'

let api = new Api('sample')

const state = {
  record: {}
}

const actions = {
  SAMPLE_TOKEN: ({ state }, params) => {
    return api.token(params)
  },
  SAMPLE_LIST: ({ state, commit }, params) => {
    return api.encall('list', params).then(res => {
      if (typeof res === 'object' && isNaN(res.length)) {
        for (let i in res) {
          commit('sampleRecord', {
            id: i,
            data: res[i]
          })
        }
        return true
      } else {
        return false
      }
    })
  },
  FETCH_RESERVE: (state, params) => {
    return api.fetch(params)
  },
  SAMPLE_SERVER: (state, params) => {
    return api.get(params)
  }
}

const mutations = {
  sampleRecord (state, res) {
    switch (parseInt(res.data.status)) {
      case 1:
        res.data.state = '申请中'
        break
      case 2:
        res.data.state = '已批准'
        break
      case 3:
        res.data.state = '已拒绝'
        break
      case 4:
        res.data.state = '因故取消'
        break
      case 5:
        res.data.state = '已测试'
        break
      default:
        res.data.state = '未知状态'
    }
    console.log(res)
    Vue.set(state.record, res.id, res.data)
  }
}

export default {
  state,
  actions,
  mutations
}
