const PangeaRequest = require('../request');
const BaseService = require('./base');

class SanitizeService extends BaseService {
  constructor(token, options) {
    super({ serviceName: 'sanitize', token: token, version: 'v1'});
  }

  geolosanitizecate(param) {
    const data = {
      param: param
    };

    return this.request.post('sanitize', data);
  }

}

module.exports = SanitizeService;