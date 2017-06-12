module.exports = class Api {
  constructor (name, ...args) {
    let o = require(`../orm/${name}`)
    this.object = Reflect.construct(o, args)
    this.promise = Promise.resolve()
    this.queue = []
  }

  call (method, params) {
    this.queue.push({ method, params })
    this.promise = this.promise.then(() => {
      let champion = this.queue.pop()
      this.object[champion.method](champion.params.params).then(result => {
        champion.params.commit({ type: champion.params.type, result })
        return result
      })
    })
  }

  token (...args) {
    return this.object.token(...args)
  }

  fetch (...args) {
    return Promise.resolve(this.object.fetch(...args))
  }

  get (...args) {
    return Promise.resolve(this.object.get(...args))
  }

  status (...args) {
    return this.object.status(...args)
  }
}
