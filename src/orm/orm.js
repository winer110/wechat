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
  }
}
