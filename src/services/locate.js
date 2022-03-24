const PangeaRequest = require('../request');
const BaseService = require('./base');

class LocateService extends BaseService {
  constructor(token, options) {
    super({ serviceName: 'locate', token: token, version: 'v1'});
  }

  geolocate(ipAddress) {
    const data = {
      'ip': ipAddress
    };

    return this.request.post('geolocate', data);
  }

}

module.exports = LocateService;