class PangeaResponse {
  constructor(gotResponse) {
    this._data = gotResponse.body || {};
    this._status = gotResponse.statusMessage || '';
    this._code = gotResponse.statusCode || '';
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