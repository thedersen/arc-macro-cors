@app
test-cors

@cors
allowOrigins https://example.com
allowMethods GET,POST,OPTIONS
allowHeaders Authorization,X-Custom-Header
exposeHeaders Content-Length,X-Custom-Header
maxAge 7200
allowCredentials true

@http
get /foo

@macros
architect/macro-http-api
arc-macro-cors
