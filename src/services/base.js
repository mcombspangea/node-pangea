const PangeaConfig = require("../config");
const PangeaRequest = require("../request");
const PangeaResponse = require("../response");

class BaseService {
  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
    - responseClass: a custom Response handler class, defaults to PangeaResponse
  */
  constructor(serviceName, token, config, responseClass) {
    if (!serviceName) throw new Error("A serviceName is required");

    this.ResponseClass = responseClass || PangeaResponse;

    this.serviceName = serviceName;
    this.token = token || "";

    this.config = config || new PangeaConfig();
    this.request = new PangeaRequest(this.serviceName, this.token, this.config);
  }

  async get(endpoint, path) {
    const gotResponse = await this.request.get(endpoint, path);

    return new this.ResponseClass(gotResponse);
  }

  async post(endpoint, data) {
    const gotResponse = await this.request.post(endpoint, data);
    console.log("RESPONSE", gotResponse);
    return new this.ResponseClass(gotResponse);
  }
}

module.exports = BaseService;
