const BaseService = require("./base");

const ConfigIdHeaderName = "X-Pangea-Redact-Config-ID";

/**
 * RedactService class provides methods for interacting with the Redact Service
 * @extends BaseService
 */
class RedactService extends BaseService {
  constructor(token, config) {
    super("redact", token, config);

    if (config.configId) {
      const configIdHeader = {
        [ConfigIdHeaderName]: config.configId,
      };
      this.request.setExtraHeaders(configIdHeader);
    }
  }

  /**
   * @summary Redact
   * @description Redact sensitive information from provided text.
   * @param {string} param - The text data to redact.
   * @returns {Promise} - A promise representing an async call to the redact endpoint
   * @example
   * const response = await redact.redact("Jenny Jenny... 415-867-5309");
   */
  redact(param) {
    const data = { param };

    return this.post("redact", data);
  }

  /**
   * @summary Redact structured
   * @description Redact sensitive information from structured data (e.g., JSON).
   * @param {Object} param - Structured data to redact
   * @returns {Promise} - A promise representing an async call to the redactStructured endpoint
   * @example
   * const data = { "phone": "415-867-5309" };
   *
   * const response = await redact.redactStructured(data);
   */
  redactStructured(param) {
    const input = { data: param };

    return this.post("redact_structured", input);
  }
}

module.exports = RedactService;
