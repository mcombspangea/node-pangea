const BaseService = require("./base");

const ConfigIdHeaderName = "X-Pangea-Audit-Config-ID";

const SupportedFields = ["actor", "action", "status", "source", "target"];

const SupportedJSONFields = ["message", "new", "old"];

/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends BaseService {
  constructor(token, config) {
    super("audit", token, config);

    if (config.configId) {
      const configIdHeader = {
        [ConfigIdHeaderName]: config.configId,
      };
      this.request.setExtraHeaders(configIdHeader);
    }
  }

  /**
   * @summary Log an entry
   * @description Create a log entry in the Secure Audit Log.
   * @param {Object} content - A structured event describing an auditable activity. Supported fields are:
   *   - actor (string): Record who performed the auditable activity.
   *   - action (string): The auditable action that occurred.
   *   - status (string): Record whether or not the activity was successful.
   *   - source (string): Used to record the location from where an activity occurred.
   *   - target (string): Used to record the specific record that was targeted by the auditable activity.
   *   - message (string|object): A message describing a detailed account of what happened.
   *     This can be recorded as free-form text or as a JSON-formatted string.
   *   - new (string|object): The value of a record after it was changed.
   *   - old (string|object): The value of a record before it was changed.
   * @returns {Promise} - A promise representing an async call to the log endpoint
   * @example
   * const auditData = {
   *    action: "add_employee",
   *    actor: user,
   *    target: data.email,
   *    status: "error",
   *    message: `Resume denied - sanctioned country from ${clientIp}`,
   *    source: "web",
   *  };
   *
   *  const logResponse = await audit.log(auditData);
   */
  log(content) {
    const event = {};

    SupportedFields.forEach((key) => {
      if (key in content) {
        event[key] = content[key];
      }
    });

    SupportedJSONFields.forEach((key) => {
      if (key in content) {
        event[key] = JSON.stringify(content[key]);
      }
    });

    const data = { event };

    return this.post("log", data);
  }

  /**
   * @summary Search for events
   * @description Search for events that match the provided search criteria.
   * @param {String} query - Natural search string; list of keywords with optional
   *   `<option>:<value>` qualifiers. The following optional qualifiers are supported:
   *   - action:
   *   - actor:
   *   - message:
   *   - new:
   *   - old:
   *   - status:
   *   - target:
   * @param {Object} options - Search options. The following search options are supported:
   *   - page_size (number): Maximum number of records to return per page.
   *   - start (string): The start of the time range to perform the search on.
   *   - end (string): The end of the time range to perform the search on. All records up to the latest if left out.
   *   - sources (array): A list of sources that the search can apply to. If empty or not provided, matches only the default source.
   * @returns {Promise} - A promise representing an async call to the search endpoint
   * @example
   * const response = await audit.search("add_employee:Gumby")
   */
  search(query, options = {}) {
    const validOptions = ["page_size", "start", "end", "sources"];
    const payload = { query };

    validOptions.forEach((name) => {
      if (name in options) {
        payload[name] = options[name];
      }
    });

    return this.post("search", payload);
  }
}

module.exports = AuditService;
