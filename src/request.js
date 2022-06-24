const got = require("got");
const pkg = require("../package.json");

class PangeaRequest {
  constructor(serviceName, token, config) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = config;
    this.extraHeaders = {};
  }

  async post(endpoint, data) {
    const options = {
      url: this.getUrl(endpoint),
      headers: this.getHeaders(),
      json: data,
      retry: this.config.requestRetries,
      responseType: "json",
    };

    try {
      const apiCall = await got.post(options);

      if (apiCall.statusCode === "202" && this.config.asyncEnabled) {
        const requestId = apiCall.body?.request_id;
        const response = await this.handleAsync(requestId);
        return response;
      }
      return apiCall;
    } catch (error) {
      return error.response;
    }
  }

  async get(endpoint, path) {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;

    const options = {
      url: this.getUrl(fullPath),
      headers: this.getHeaders(),
      retry: this.config.requestRetries,
      responseType: "json",
    };

    try {
      return await got.get(options);
    } catch (error) {
      return error.response;
    }
  }

  async handleAsync(requestId) {
    let retryCount = 0;

    while (retryCount < this.config.asyncRetries) {
      retryCount += 1;
      const delay = retryCount * retryCount * 500;

      // eslint-disable-next-line no-await-in-loop
      await this.sleep(delay);
      // eslint-disable-next-line no-await-in-loop
      const response = await this.get("request", requestId);
      console.log("Async Status", response.code);
      if (!(response.code === "202" && retryCount < this.config.asyncRetries)) {
        return response;
      }
    }

    // this should never be reached
    return "";
  }

  setExtraHeaders(headers) {
    this.extraHeaders = { ...headers };
  }

  getUrl(path) {
    const versionPath = this.config.apiVersion ? `/${this.config.apiVersion}` : "";
    const url = `https://${this.serviceName}.${this.config.baseDomain}${versionPath}/${path}`;

    return url;
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": `Pangea Node ${pkg.version}`,
      Authorization: `Bearer ${this.token}`,
    };

    if (Object.keys(this.extraHeaders).length > 0) {
      Object.assign(headers, this.extraHeaders);
    }

    return headers;
  }

  static sleep(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
}

module.exports = PangeaRequest;
