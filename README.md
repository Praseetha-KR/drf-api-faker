# DRF API Faker

Serve Django Rest Framework compliant dummy API responses for local development. This is a wrapper on [json-server](https://github.com/typicode/json-server).


## Install dependencies
```bash
npm i
```

## Run server

```bash
node server.js
```

Supported environment variables:

| Key                         | Usage                    | Value type                   | Default value        |
|-----------------------------|--------------------------|------------------------------|----------------------|
| `DATA_FILE`                 | Data json file path       | `<str>`                      | `api.json`           |
| `DEFAULT_PAGINATION_LIMIT`  | DRF pagination limit     | `<int>`                      | `10`                 |
| `DEFAULT_PAGINATION_OFFSET` | DRF pagination offset    | `<int>`                      | `0`                  |
| `API_NAMESPACES`            | Supported API namespaces | `<comma separated patterns>` | `'/api/v1/*,/api/*'` |


## Adding dummy data

Dummy data can be added in `db.json`

If you want to speacify another file instead, specify via environment variable:

```bash
DATA_FILE=api.json node server.js
```

---

## Sample Requests with existing db.json

#### POST
request:

```bash
POST http://localhost:3000/users
```

payload:

```json
{
  "name": "Name 12"
}
```
response:
```json
{
  "name": "Name 12",
  "createdAt": 1555447139186,
  "id": 12
}
```


#### List (with limit-offset pagination)

request:

```bash
GET http://localhost:3000/users
```

response:

```json
{
  "count": 12,
  "next": "http://localhost:3000/users?limit=3&offset=6",
  "prev": "http://localhost:3000/users?limit=3",
  "results": [
    {
      "name": "Name 4",
      "createdAt": 1555447110411,
      "id": 4
    },
    {
      "name": "Name 5",
      "createdAt": 1555447113829,
      "id": 5
    },
    {
      "name": "Name 6",
      "createdAt": 1555447117217,
      "id": 6
    }
  ]
}
```

#### Detail

request:

```bash
GET http://localhost:3000/posts/3
```

response:

```json
{
  "id": 3,
  "title": "Title 1",
  "createdAt": 1555447152343,
  "userId": 1
}
```

#### Detail with _embed

request:

```bash
GET http://localhost:3000/posts/3?_embed=comments
```

response:

```json
{
  "id": 3,
  "title": "Title 1",
  "createdAt": 1555447152343,
  "userId": 1,
  "comments: [
    {
      "text": "Comment Text 6",
      "createdAt": 1555447264637,
      "postId": 3,
      "id": 6
    }
  ]
}
```

#### Detail with _expand

request:

```bash
GET http://localhost:3000/comments/1?_expand=post
```

response:

```json
{
  "text": "Comment Text 1",
  "createdAt": 1555447237325,
  "postId": 1,
  "id": 1,
  "post": {
    "title": "Title 1",
    "createdAt": 1555447152343,
    "userId": 1,
    "id": 1
  }
}
```

#### Nested List

request:

```bash
GET http://localhost:3000/posts/2/comments
```

response:

```json
{
  "count": 2,
  "next": null,
  "prev": null,
  "results": [
    {
      "text": "Comment Text 4",
      "createdAt": 1555447250265,
      "postId": 2,
      "id": 4
    },
    {
      "text": "Comment Text 5",
      "createdAt": 1555447255593,
      "postId": 2,
      "id": 5
    },
  ]
}
```