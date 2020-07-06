@app
test-cors

@aws
region eu-central-1
apigateway http

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
arc-macro-cors
