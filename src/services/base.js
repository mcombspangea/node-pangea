const PangeaRequest = require('../request');

class BaseService {
  constructor(params) {
    this.serviceName = params.serviceName || '';
    this.version = params.version || '';
    this.token = params.token || '';

    this.request = new PangeaRequest(this.serviceName, this.token, { version: this.version });
  }

  log(data) {
    return this.request.post('log', query);
  }

  search(query) {
    const resp = this.request.post('search', query);
    console.log("RESP", resp);
  }
}

module.exports = BaseService;