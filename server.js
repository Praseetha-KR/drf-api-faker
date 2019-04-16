const jsonServer = require('json-server')
const path = require('path')
const url = require('url')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({noCors: true})

function getBaseURL(req) {
  const root = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
  return `${root}${req.path}`;
}

server.use(middlewares)
server.use((req, res, next) => {
  req._query ={}
  if (req.query) {
    req._query = Object.assign({}, req.query);
  }
  next()
})

router.render = function (req, res) {
  let _data = {}
  // GET
  if (req.method === 'GET') {
    _data = res.locals.data
    const baseURL = getBaseURL(req)
    const count = _data.length
    let next = null
    let prev = null

    if (res.statusCode === 200) {
      let offset = parseInt(req._query.offset, 10) || 0
      let limit = parseInt(req._query.limit, 10) || 10
      let paginated_data = _data.slice(offset, offset + limit)

      if ((offset + limit) < count) {
        next = `?limit=${limit}&offset=${offset + limit}`
      }
      if (offset != 0) {
        if ((offset - limit) > 0) {
          prev = `?limit=${limit}&offset=${offset - limit}`
        } else {
          prev = `?limit=${limit}`
        }
      }

      res.jsonp({
        count: count,
        prev: prev ? (baseURL + prev) : prev,
        next: next ? (baseURL + next) : next,
        results: paginated_data,
      })
    }
  }
  // POST, PUT, PATCH, DELETE
  else {
    _data = req.body
    res.jsonp(_data)
  }
}

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000')
})
