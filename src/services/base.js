const PangeaConfig = require('../config');
const PangeaRequest = require('../request');
const PangeaResponse = require("../response");

class BaseService {
  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
    - response_class: a custom Response handler class, defaults to PangeaResponse
  */
  constructor(serviceName, token, config, response_class) {
    if (!serviceName) throw new Error("A serviceName is required");

    this.serviceName = serviceName;
    this.token = token || '';

    this.config = config || new PangeaConfig();
    this.response_class = response_class || PangeaResponse
    this.request = new PangeaRequest(this.serviceName, this.token, this.config);
  }

  async get(endpoint, path) {
    const raw_response = await this.request.get(endpoint, path);

    return new this.response_class(raw_response);
  }

  async post(endpoint, data) {
    const raw_response = await this.request.post(endpoint, data);

    return new this.response_class(raw_response);
  }
}

module.exports = BaseService;