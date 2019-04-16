const jsonServer = require('json-server')
const path = require('path')
const url = require('url')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({noCors: true})

DEFAULT_LIMIT = process.env.DEFAULT_PAGINATION_LIMIT || 10
DEFAULT_OFFSET = process.env.DEFAULT_PAGINATION_OFFSET || 0
API_NAMESPACES = process.env.API_NAMESPACES || '/api/v1/*,/api/*'

function getFullURL(req) {
  const root = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
  return `${root}${req.originalUrl}`;
}

function getBaseURL(req) {
  const url = getFullURL(req) || ''
  try {
    return url.split('?')[0]
  } catch(_) {}
  return url
}

function getPrevNext(baseURL, limit, offset, count) {
  let next = null
  let prev = null
  
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
  return {
    prev: prev ? (baseURL + prev) : prev, 
    next: next ? (baseURL + next) : next
  }
}

function rewriteAPINamespaces(namespaceCsv) {
  const ns = namespaceCsv.replace(/\s/g, '').split(',')
  return ns.reduce(function(acc, curr) {
    acc[curr] = '/$1'
    return acc
  }, {})
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
  // GET
  if (req.method === 'GET') {
    if (res.statusCode === 200) {
      let _data = res.locals.data
      if (Array.isArray(_data)) {
        let offset = parseInt(req._query.offset, 10) || DEFAULT_OFFSET
        let limit = parseInt(req._query.limit, 10) || DEFAULT_LIMIT
        let count = _data.length
        let results = _data.slice(offset, offset + limit)
        let {prev, next} = getPrevNext(getBaseURL(req), limit, offset, count)
        res.jsonp({count, prev, next, results})
      } else {
        res.jsonp(_data)
      }
    }
  }
  // POST, PUT, PATCH, DELETE
  else {
    res.jsonp(req.body)
  }
}

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.use(jsonServer.rewriter(rewriteAPINamespaces(API_NAMESPACES)))
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000')
})
