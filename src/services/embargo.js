const BaseService = require("./base");

class EmbargoService extends BaseService {
  constructor(token, config) {
    super("embargo", token, config);
  }

  check(ipAddress) {
    const data = {
      ip: ipAddress,
    };

    return this.post("check", data);
  }
}

module.exports = EmbargoService;
