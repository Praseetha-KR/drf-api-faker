# Fake DRF data Server

[json-server](https://github.com/typicode/json-server) wrapper for Django Rest Framework (DRF) API response.

### How to run

#### Install dependencies
```
npm i
```

#### Run server

```
node server.js
```

Supported environment variables:

| Key                         | Value type                   | Default value        |
|-----------------------------|------------------------------|----------------------|
| `DEFAULT_PAGINATION_LIMIT`  | `<int>`                      | `10`                 |
| `DEFAULT_PAGINATION_OFFSET` | `<int>`                      | `0`                  |
| `API_NAMESPACES`            | `<comma separated patterns>` | `'/api/v1/*,/api/*'` |
