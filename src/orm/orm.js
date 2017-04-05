let Axios = require('axios')

module.exports = {
  rpc () {
    return Axios.create({
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      withCredentials: true,
      transformRequest: [(data) => {
        return JSON.stringify(data)
      }]
    })
  },
  rpcPost (url, method, params) {
    return this.rpc().post(url, {
      'jsonrpc': '2.0',
      'method': method,
      'id': 1,
      'params': params
    }).then(res => {
      return res.data.result
    })
  }
}
