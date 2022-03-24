const PangeaRequest = require('../request');
const BaseService = require('./base');

class AuditService extends BaseService {
  constructor(token, options) {
    super({ serviceName: 'audit', token: token, version: 'v1'});
  }

  log(data) {
    return this.request.post('log', query);
  }

  search(data) {
    const query = {
      query: data
    };

    return this.request.post('search', query);
  }
}

module.exports = AuditService;