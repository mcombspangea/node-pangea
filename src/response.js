const { HTTPError } = require("got/dist/source");

class PangeaResponse {
  constructor(response) {
    if (response instanceof HTTPError) {
      this.gotResponse = response.response;
      this.success = false;
    } else {
      this.gotResponse = response;
      this.success = true;
    }

    this.data = this.gotResponse.body || {};
    this.status = this.gotResponse.statusMessage || "";
    this.code = this.gotResponse.statusCode || "";
  }

  get result() {
    return this.data?.result;
  }

  get status() {
    return this.status;
  }

  get code() {
    return this.code;
  }

  get requestId() {
    return this.data?.request_id;
  }
}

module.exports = PangeaResponse;
