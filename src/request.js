const got = require('got');
const pkg = require('../package.json');
const PangeaResponse = require('./response');

class PangeaRequest {
  constructor(serviceName, token, options) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    // TODO: move to config file
    this.baseDomain = 'dev.pangea.cloud';
    this.retries = 3;
    this.async_retries = 4;

    this.serviceName = serviceName;
    this.token = token;
    this.version = options.version || '';
  }

  async post(endpoint, data) {
    const options = {
      url: this._getUrl(endpoint),
      headers: this._getHeaders(),
      json: data,
      retry: this.retries,
      responseType: 'json'
    };
  
    try {
      const apiCall = await got.post(options);

      if (apiCall.statusCode == '202') {
        const requestId = apiCall.body?.request_id;
        const response = await this._handle_async(requestId);
        return response;
      } else {
        return new PangeaResponse(apiCall);
      }
    }
    catch(error) {
      console.log('ERROR', error);
    }
  }

  async get(endpoint, path) {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;

    const options = {
      url: this._getUrl(fullPath),
      headers: this._getHeaders(),
      retry: this.retries,
      responseType: 'json'
    };

    try {
      const apiCall = await got.get(options);
      return new PangeaResponse(apiCall);
    }
    catch(error) {
      console.log('ERROR', error);
    }
  }

  async _handle_async(requestId) {
    let retryCount = 0;

    while (true) {
      if (retryCount < this.async_retries) {
        retryCount++;
        const delay =  (retryCount * retryCount) * 500;

        await this._sleep(delay);
        const response = await this.get('request', requestId);

        if (!(response.code == '202' && retryCount < this.async_retries)) {
          return response;
        }
      }
    }    
  }

  _getUrl(path) {
    const version_path = this.version ? `/${this.version}` : '';
    const url = `https://${this.serviceName}.${this.baseDomain}${version_path}/${path}`;

    return url;
  }

  _getHeaders() {
    const headers = {
      'User-Agent': `Pangea Node ${pkg.version}`,
      'Authorization': `Bearer ${this.token}`
    };

    return headers;
  }

  _sleep(delay) {
    return new Promise(resolve => {
      setTimeout(resolve, delay)
    })
  }
}

module.exports = PangeaRequest;