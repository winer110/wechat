export default class Api {
  constructor (name, ...args) {
    let o = require(`../orm/${name}`)
    this.object = Reflect.construct(o, args)
  }
  fetch (params) {
    return this.object.fetch(params)
  }
}
