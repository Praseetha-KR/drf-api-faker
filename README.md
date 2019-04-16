# Fake DRF data Server

[json-server](https://github.com/typicode/json-server) wrapper for Django Rest Framework (DRF) API response.


## Install dependencies
```
npm i
```

## Run server

```
node server.js
```

Supported environment variables:

| Key                         | Value type                   | Default value        |
|-----------------------------|------------------------------|----------------------|
| `DEFAULT_PAGINATION_LIMIT`  | `<int>`                      | `10`                 |
| `DEFAULT_PAGINATION_OFFSET` | `<int>`                      | `0`                  |
| `API_NAMESPACES`            | `<comma separated patterns>` | `'/api/v1/*,/api/*'` |


## Adding dummy data

Dummy data can be added in `db.json`

## Sample Requests with existing db.json

request:
```
GET http://localhost:3000/users
```
response:
```
{
    "count": 12,
    "next": "http://localhost:3000/users?limit=3&offset=6",
    "prev": "http://localhost:3000/users?limit=3",
    "results": [
        {
            "id": 4,
            "name": "Name 4"
        },
        {
            "id": 5,
            "name": "Name 5"
        },
        {
            "id": 6,
            "name": "Name 6"
        }
    ]
}
```
---

request:
```
GET http://localhost:3000/users/1
```
response:
```
{
    "id": 1,
    "name": "Name 1"
}
```
---

request:
```
GET http://localhost:3000/users/1/posts
```
response:
```
"count": 3,
    "next": null,
    "prev": null,
    "results": [
        {
            "id": 11,
            "title": "Title 13",
            "userId": 3
        },
        {
            "id": 14,
            "title": "Title 14",
            "userId": 3
        },
        {
            "id": 15,
            "title": "Title 15",
            "userId": 3
        }
    ]
}
```
---

request:
```
GET http://localhost:3000/posts/1/comments
```
response:
```
{
    "count": 2,
    "next": null,
    "prev": null,
    "results": [
        {
            "id": 1,
            "postId": 1,
            "text": "Comment Text 1"
        },
        {
            "id": 2,
            "postId": 1,
            "text": "Comment Text 2"
        }
    ]
}
```