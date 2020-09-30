'use strict';
const aws = require('aws-sdk');

class InvokeLambdaLoad {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      deploy: {
         lifecycleEvents: ['displayStackOutputs'],
      },
    };

    this.hooks = {
      'after:aws:info:displayStackOutputs': this.afterDisplayStackOutputs.bind(this)
    };
  }

  afterDisplayStackOutputs() {
    console.log('Executing lambda data load');

    aws.config.update({
      region: this.serverless.service.provider.region
    })
    var lambda = new aws.Lambda();

    var stage = this.options.stage ? this.options.stage : this.serverless.service.provider.stage;

    var invokeParams = {
      FunctionName: this.serverless.service.functions.loadSampleDataToDynamo.name,
      Payload: JSON.stringify({
        "BucketName": `near-earth-asteroids-${stage}`,
        "FileName": "sampleData.json",
        "TableName": `NearEarthAsteroids_${stage}`
      })
    }
    lambda.invoke(invokeParams, function(err, data) {
      if(err) {
        console.log(err);
        console.log(err.stack);
        console.log("Error encountered, please review");
      } else {
        console.log(data);
        console.log("Lambda data load successful!!!!!!");
      }
    })
  }
}

module.exports = InvokeLambdaLoad;