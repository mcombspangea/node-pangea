const BaseService = require("./base");

class TestService extends BaseService {
  constructor(token, config) {
    super("tester", token, config);
  }

  asyncCall(data) {
    return this.request.post("go/pri/test", data);
  }
}

module.exports = TestService;
