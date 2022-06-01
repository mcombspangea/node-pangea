const BaseService = require('./base');

class RedactService extends BaseService {
  constructor(token, config) {
    super('redact', token, config);
  }

  redact(param) {
    const data = {
      param: param
    };

    return this.post('redact', data);
  }

}

module.exports = RedactService;