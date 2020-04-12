const toLogicalID = require('@architect/utils/to-logical-id');

module.exports = function(arc, cfn) {
  if (!arc.cors) {
    return cfn;
  }

  const existingApi = getExistingApiName(cfn);
  const apiName = existingApi || `${toLogicalID(arc.app[0])}Api`;

  if (!existingApi) {
    createHttpApiResource(apiName, cfn);
  }

  const config = getConfig(arc);

  cfn.Resources[apiName].Properties.CorsConfiguration = {
    AllowOrigins: config.allowOrigins,
    AllowHeaders: config.allowHeaders,
    ExposeHeaders: config.exposeHeaders,
    AllowMethods: config.allowMethods,
    MaxAge: config.maxAge,
  };

  if (config.allowOrigins[0] !== '*') {
    cfn.Resources[apiName].Properties.CorsConfiguration.AllowCredentials = config.allowCredentials;
  }

  return cfn;
};

function getExistingApiName(cfn) {
  return Object.keys(cfn.Resources).find(
    resource => cfn.Resources[resource].Type === 'AWS::Serverless::HttpApi'
  );
}

function createHttpApiResource(apiName, cfn) {
  cfn.Resources[apiName] = {
    Type: 'AWS::Serverless::HttpApi',
    Properties: {
      FailOnWarnings: true,
    },
  };

  cfn.Outputs.HTTP = {
    Description: 'API Gateway',
    Value: {
      'Fn::Sub': [
        'https://${idx}.execute-api.${AWS::Region}.amazonaws.com', // eslint-disable-line no-template-curly-in-string
        {
          idx: {
            Ref: apiName,
          },
        },
      ],
    },
  };

  for (const resource of Object.keys(cfn.Resources)) {
    if (cfn.Resources[resource].Type === 'AWS::Serverless::Function') {
      const eventname = `${resource}Event`;
      cfn.Resources[resource].Properties.Events[eventname].Properties.ApiId = {
        Ref: apiName,
      };

      if (cfn.Resources[resource].Properties.Events.ImplicitApi) {
        delete cfn.Resources[resource].Properties.Events.ImplicitApi;
      }
    }
  }
}

function getConfig(arc) {
  const defaultConfig = {
    maxAge: 600,
    allowCredentials: false,
    allowOrigins: ['*'],
    allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'x-requested-with'],
    allowMethods: ['*'],
    exposeHeaders: [],
  };
  return arc.cors.reduce((cfg, val) => {
    if (typeof val[1] === 'string') {
      cfg[val[0]] = val[1].split(',').map(s => s.trim());
    } else {
      cfg[val[0]] = val[1];
    }

    return cfg;
  }, defaultConfig);
}
