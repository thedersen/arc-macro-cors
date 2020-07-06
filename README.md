# arc-macro-cors

Enable CORS for [Architect](https://arc.codes) HTTP APIs (APIG HTTP Api only).


###Install:

`npm i arc-macro-cors`

And add to your .arc-file for default CORS settings:

```arc
@app
myapp

@cors
@http
get /
get /foo
post /foo

@macros
arc-macro-cors
```
Or configure specific CORS settings:

```arc
@app
myapp

@cors
allowOrigins https://example.com
allowMethods GET,POST,OPTIONS
allowHeaders Authorization,X-Custom-Header
exposeHeaders Content-Length,X-Custom-Header
maxAge 7200
allowCredentials true

@http
get /
get /foo
post /foo

@macros
arc-macro-cors
```

See [AWS::Serverless::HttpApi/HttpApiCorsConfiguration](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapicorsconfiguration.html) for more information.
