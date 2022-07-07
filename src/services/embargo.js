const BaseService = require("./base");

/**
 * EmbargoService class provides methods for interacting with the Embargo Service
 * @extends BaseService
 */
class EmbargoService extends BaseService {
  constructor(token, config) {
    super("embargo", token, config);
  }

  /**
   * @summary Embargo
   * @description Check IPs and country codes against known sanction and trade embargo lists.
   * @param {String} ipAddress - Geolocate this IP and check the corresponding country against 
   *   the enabled embargo lists. Note: Either the IP or ISO_CODE parameter must be provided, 
   *   not both.
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @example
   * const response = await embargo.check("1.1.1.1")
   */
  check(ipAddress) {
    const data = {
      ip: ipAddress,
    };

    return this.post("check", data);
  }
}

module.exports = EmbargoService;
