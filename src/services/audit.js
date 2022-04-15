const PangeaRequest = require('../request');
const BaseService = require('./base');

class AuditService extends BaseService {
  constructor(token, options) {
    super({ serviceName: 'audit', token: token, version: 'v1'});
  }

  log(input) {
    const params = ["action", "actor", "target", "status", "old", "new", "message"];    
    let data = {};

    for (let key in params) {
      if (key in input) {
        data[key] = params[key];
      }
    }
    
    return this.request.post('log', data);
  }

  search(data) {
    const query = {
      query: data
    };

    return this.request.post('search', query);
  }
}

module.exports = AuditService;