export default class Api {
  constructor (name, ...args) {
    let o = require(`../orm/${name}`)
    this.object = Reflect.construct(o, args)
  }

  token () {
    return this.object.token()
  }

  fetch (...args) {
    return Promise.resolve(this.object.fetch(...args))
  }
}
