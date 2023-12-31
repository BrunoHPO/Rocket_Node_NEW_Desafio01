import http from 'node:http';
import { json } from './middlewares/json.js';
//import { json } from './middlewares/csv.js';
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (request, response) => {
  const { method, url, headers } = request;

  await json(request, response)

  console.log(method, url);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  console.log(route);

  if (route) {
    const routeParams = request.url.match(route.path)

    console.log(routeParams)

    const { query, ...params } = routeParams.groups

    request.params = params
    request.query = query ? extractQueryParams(query) : {}

    return route.handler(request, response)
  }

  return response.writeHead(404).end()
})

server.listen(3333)