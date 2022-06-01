const BaseService = require('./base');

class AuditService extends BaseService {
  constructor(token, config) {
    super('audit', token, config);
  }

  log(input) {
    const params = ["action", "actor", "target", "status", "old", "new", "message"];
    let data = {};

    for (let key in params) {
      if (key in input) {
        data[key] = params[key];
      }
    }

    return this.post('log', data);
  }

  search(data) {
    const query = {
      query: data
    };

    return this.post('search', query);
  }
}

module.exports = AuditService;