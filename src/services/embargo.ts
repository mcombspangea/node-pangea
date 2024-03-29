import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Embargo } from "../types.js";

/**
 * EmbargoService class provides methods for interacting with the Embargo Service
 * @extends BaseService
 */
class EmbargoService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("embargo", token, config);
    this.apiVersion = "v1";
  }

  /**
   * @summary Embargo
   * @description Check an IP against known sanction and trade embargo lists.
   * @param {String} ipAddress - Geolocate this IP and check the corresponding country against
   *   the enabled embargo lists.
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @example
   * const response = await embargo.ipCheck("1.1.1.1")
   */
  ipCheck(ipAddress: string): Promise<PangeaResponse<Embargo.CheckResponse>> {
    const data = {
      ip: ipAddress,
    };

    return this.post("ip/check", data);
  }

  /**
   * @summary Embargo
   * @description Check a country code against known sanction and trade embargo lists.
   * @param {String} isoCode - Check the  country against code the enabled embargo lists.
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @example
   * const response = await embargo.isoCheck("CU")
   */
  isoCheck(isoCode: string): Promise<PangeaResponse<Embargo.CheckResponse>> {
    const data = {
      iso_code: isoCode,
    };

    return this.post("iso/check", data);
  }
}

export default EmbargoService;
