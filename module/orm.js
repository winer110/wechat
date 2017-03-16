module.exports = (name, params) => {
  let orm = require(`../orm/${name}`)
  console.log(`../orm/${name}`)
  return new orm(params)
}

