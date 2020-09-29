'use strict';

class InvokeLambdaLoad {
  constructor() {
    this.commands = {
      deploy: {
        lifecycleEvents: ['resources', 'displayStackOutputs'],
      },
    };

    this.hooks = {
      'after:deploy:resources': this.afterDeployResources,
      'after:aws:info:displayStackOutputs': this.afterDisplayStackOutputs
    };
  }

  afterDeployResources() {
    console.log('After Deploy Resources');
  }

  afterDisplayStackOutputs() {
    console.log('After Display Stack Outputs');
    // TODO execute lambda
    // TODO maybe push sampleData to S3?
  }
}

module.exports = InvokeLambdaLoad;