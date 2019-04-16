const jsonServer = require('json-server')
const path = require('path')
const url = require('url')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({noCors: true})

function parseQueryStringToJson(query) {
  if(!query) {
    return {}
  }

	const pairs = query.split('&')
	return pairs.reduce((c, p) => {
		const [key, value] = p.split('=')
		c[key] = value
		return c
	}, {})
}

// server.use((req, res, next) => {
//   const query = url.parse(req.url).query
//   req.query = parseQueryStringToJson(query)
//   next()
// })



server.use(middlewares)
server.use((req, res, next) => {
  if (req.query) {
    req._query = Object.assign({}, req.query);
  }
  // Continue to JSON Server router
  next()
})

router.render = function (req, res) {
  let _data = {}

  // GET
  if (req.method === 'GET') {
    _data = res.locals.data
  }

  // POST, PUT, PATCH, DELETE, ...
  else {
    _data = req.body
  }

  res.jsonp({
    breq: req._query,
    code: 0,
    data: _data,
    msg: 'success',
  })
//   var queryStrings = req.query
//   debugger
//   let data
//   var offset = parseInt(queryStrings.offset, 10)
//   var limit = parseInt(queryStrings.limit, 10)
//   if (res.statusCode === 200) {
//     data = {
//       Result: "OK",
//       Records: res.locals.data.slice(offset, offset + limit)
//     }
//   }
//   res.json(data)
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
  console.log('JSON Server is running')
})
