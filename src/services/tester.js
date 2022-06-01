const BaseService = require('./base');

class TestService extends BaseService {
  constructor(token, config) {
    super('tester', token, config);
  }

  async_call(data) {
    return this.request.post('go/pri/test', data);
  }

}

module.exports = TestService;