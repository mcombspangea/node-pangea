const PangeaRequest = require('../request');
const BaseService = require('./base');

class TestService extends BaseService {
  constructor(token, options) {
    super({ serviceName: 'tester', token: token, version: ''});
  }

  async_call(data) {
    return this.request.post('go/pri/test', data);
  }

}

module.exports = TestService;