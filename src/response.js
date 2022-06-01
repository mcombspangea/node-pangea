const { HTTPError } = require("got/dist/source");

class PangeaResponse {
  constructor(response) {
    if (response instanceof HTTPError) {
      this.gotResponse = response.response;
      this.success = false;
    }
    else {
      this.gotResponse = response;
      this.success = true;
    }

    this._data = this.gotResponse.body || {};
    this._status = this.gotResponse.statusMessage || '';
    this._code = this.gotResponse.statusCode || '';
  }

  get result() {
    return this._data?.result;
  }

  get status() {
    return this._status;
  }

  get code() {
    return this._code;
  }

  get request_id() {
    return this._data?.request_id;
  }
}

module.exports = PangeaResponse;