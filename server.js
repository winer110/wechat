process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'

const fs = require('fs')
const path = require('path')
const express = require('express')
// const favicon = require('serve-favicon')
const compression = require('compression')
const serialize = require('serialize-javascript')
const resolve = file => path.resolve(__dirname, file)

const app = express()
const bodyParser = require('body-parser')

const apiRouter = require('./router/api')

// 顺序语义化，给Promise增加对于的Done方法来实现收尾操作
Promise.prototype.done = function (onFulfilled, onRejected) {
  this
    .then(onFulfilled, onRejected)
    .catch(function (reason) {
      onRejected(resson)
    })
}

let indexHTML // generated by html-webpack-plugin
let renderer  // created from the webpack-generated server bundle
if (isProd) {
  // in production: create server renderer and index HTML from real fs
  renderer = createRenderer(fs.readFileSync(resolve('./dist/server-bundle.js'), 'utf-8'))
  indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
} else {
  // in development: setup the dev server with watch and hot-reload,
  // and update renderer / index HTML on file change.
  require('./build/setup-dev-server')(app, {
    bundleUpdated: bundle => {
      renderer = createRenderer(bundle)
    },
    indexUpdated: index => {
      indexHTML = parseIndex(index)
    }
  })
}

function createRenderer (bundle) {
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

function parseIndex (template) {
  const contentMarker = '<!-- APP -->'
  const i = template.indexOf(contentMarker)
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use('/service-worker.js', serve('./dist/service-worker.js'))
app.use('/dist', serve('./dist'))
app.use('/public', serve('./public'))

let dataConfig = require('./config/database')

let session = require('express-session')
let redisStore = require('connect-redis')(session)

let redis = require('redis')
let redisClient = redis.createClient(dataConfig.redis.port, dataConfig.redis.host)
let sessionStore = new redisStore({ client: redisClient })

var cookieParser = require('cookie-parser')
app.use(cookieParser('genee'))
app.use(session({
  key: 'genee',
  secret: '83719730',
  store: sessionStore,
  resave: true,
  saveUninitialized: false
}));

app.use(compression())
// 让express能识别前端VUE的POST数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/* 验证wechat网站信任的代码 */
// let wechatAuth = require('./lib/wechatAuth')
// app.use(wechatAuth.sign(require('./config/wechat')))

/* 手动CGI创建微信菜单 */
app.get('/creatWechatMenu', (req, res) => {
  let wechatConfig = require('./config/wechat')
  let wechatAPI = require('wechat-api');
  let api = new wechatAPI(wechatConfig.wechat.appID, wechatConfig.wechat.appsecret);
  api.createMenu(wechatConfig.menu, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send('微信菜单创建成功:' + result)
    }
  })
})

app.use('/wechat', (req, res, next) => {
  console.log('hahaha')
  console.log(req.session)
  if (!req.session.auth) {
    res.redirect('/wechatAuth')
  }
  next()
})

let wechatAuth = require('./lib/wechatAuth')
app.get('/wechatAuth', wechatAuth.token(require('./config/wechat')))
app.get('/wechat/callback', wechatAuth.entrance(require('./config/wechat')))
/* 提供给Vue前端进行获取数据的接口信息, 通过后端Express的Router进行分发 */
app.use('/api', apiRouter)


app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('等待后端编译. 请等待几分钟...')
  }

  res.setHeader("Content-Type", "text/html");
  var s = Date.now()
  const context = {
    url: req.url,
    user: req.session.user,
    openid: req.session.openid,
    unionid: req.session.unionid
  }
  const renderStream = renderer.renderToStream(context)

  renderStream.once('data', () => {
    res.write(indexHTML.head)
  })

  renderStream.on('data', chunk => {
    res.write(chunk)
  })

  renderStream.on('end', () => {
    // embed initial store state
    if (context.initialState) {
      res.write(
        `<script>window.__INITIAL_STATE__=${
          serialize(context.initialState, { isJSON: true })
        }</script>`
      )
    }
    res.end(indexHTML.tail)
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
})

const port = process.env.PORT || 4070
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
