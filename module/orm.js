module.exports = (name, params) => {
  let orm = require(`../orm/${name}`)
  return new orm(params)
}
