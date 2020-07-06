module.exports = function (arc, cfn) {
  if (!arc.cors) {
    return cfn;
  }

  const apiName = getApiName(cfn);
  const config = getConfig(arc);

  cfn.Resources[apiName].Properties.CorsConfiguration = {
    AllowOrigins: config.allowOrigins,
    AllowHeaders: config.allowHeaders,
    ExposeHeaders: config.exposeHeaders,
    AllowMethods: config.allowMethods,
    MaxAge: config.maxAge,
  };

  if (config.allowOrigins[0] !== '*') {
    cfn.Resources[apiName].Properties.CorsConfiguration.AllowCredentials =
      config.allowCredentials;
  }

  return cfn;
};

function getApiName(cfn) {
  return Object.keys(cfn.Resources).find(
    (resource) => cfn.Resources[resource].Type === 'AWS::Serverless::HttpApi'
  );
}

function getConfig(arc) {
  const defaultConfig = {
    maxAge: 600,
    allowCredentials: false,
    allowOrigins: ['*'],
    allowHeaders: [
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'x-requested-with',
    ],
    allowMethods: ['*'],
    exposeHeaders: [],
  };

  function splitStrings([key, value]) {
    if (typeof value === 'string') {
      return [key, value.split(',')];
    }

    return [key, value];
  }

  return {
    ...defaultConfig,
    ...Object.fromEntries(arc.cors.map((setting) => splitStrings(setting))),
  };
}
