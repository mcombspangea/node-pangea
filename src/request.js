const got = require('got');
const pkg = require('../package.json');
const PangeaResponse = require('./response');

class PangeaRequest {
  constructor(serviceName, token, config) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = config;
    this.extra_headers = {};
  }

  async post(endpoint, data) {
    const options = {
      url: this._getUrl(endpoint),
      headers: this._getHeaders(),
      json: data,
      retry: this.config.requestRetries,
      responseType: 'json'
    };

    try {
      const apiCall = await got.post(options);

      if (apiCall.statusCode == '202' && this.config.asyncEnabled) {
        const requestId = apiCall.body?.request_id;
        const response = await this._handle_async(requestId);
        return response;
      } else {
        return apiCall;
      }
    }
    catch (error) {
      return error.response;
    }
  }

  async get(endpoint, path) {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;

    const options = {
      url: this._getUrl(fullPath),
      headers: this._getHeaders(),
      retry: this.config.requestRetries,
      responseType: 'json'
    };

    try {
      return await got.get(options);
    }
    catch (error) {
      return error.response;
    }
  }  

  async _handle_async(requestId) {
    let retryCount = 0;

    while (true) {
      if (retryCount < this.config.asyncRetries) {
        retryCount++;
        const delay = (retryCount * retryCount) * 500;

        await this._sleep(delay);
        const response = await this.get('request', requestId);

        if (!(response.code == '202' && retryCount < this.config.asyncRetries)) {
          return response;
        }
      }
    }
  }

  setExtraHeaders(headers) {
    this.extra_headers = { ...headers };
  }

  _getUrl(path) {
    const version_path = this.config.apiVersion ? `/${this.config.apiVersion}` : '';
    const url = `https://${this.serviceName}.${this.config.baseDomain}${version_path}/${path}`;

    return url;
  }

  _getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": `Pangea Node ${pkg.version}`,
      "Authorization": `Bearer ${this.token}`
    };

    if (Object.keys(this.extra_headers).length > 0) {
      Object.assign(headers, this.extra_headers);
    }

    return headers;
  }

  _sleep(delay) {
    return new Promise(resolve => {
      setTimeout(resolve, delay)
    })
  }
  
}

module.exports = PangeaRequest;