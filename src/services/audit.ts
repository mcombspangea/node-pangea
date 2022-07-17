import PangeaResponse from "../response";
import BaseService from "./base";
import PangeaConfig from "../config";

const SupportedFields = ["actor", "action", "status", "source", "target"];

const SupportedJSONFields = ["message", "new", "old"];

interface AuditEvent {
  message: string | JSON;
  actor?: string;
  action?: string;
  status?: string;
  source?: string;
  new?: string | JSON;
  old?: string | JSON;
}

/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends BaseService {
  verify: boolean;

  constructor(token: string, config: PangeaConfig) {
    super("audit", token, config);
    this.configIdHeaderName = "X-Pangea-Audit-Config-ID";
    this.verify = false;
    this.init();
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
  log(content: AuditEvent): Promise<PangeaResponse> {
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
   *   - limit (number): Maximum number of records to return per page.
   *   - start (string): The start of the time range to perform the search on.
   *   - end (string): The end of the time range to perform the search on. All records up to the latest if left out.
   *   - sources (array): A list of sources that the search can apply to. If empty or not provided, matches only the default source.
   * @returns {Promise} - A promise representing an async call to the search endpoint
   * @example
   * const response = await audit.search("add_employee:Gumby")
   */
  search(query: string, options = {}): Promise<PangeaResponse> {
    const defaults = {
      limit: 20,
      start: "",
      end: "",
    };

    const payload = { query };
    Object.keys(defaults).forEach((name) => {
      if (name in options) {
        payload[name] = options[name];
      } else if (defaults[name] !== "") {
        payload[name] = defaults[name];
      }
    });

    // pass restriction as search_restriction
    if ("restriction" in options) {
      payload["search_restriction"] = options["restriction"];
    }

    // Store the verify mode for the search, used by results
    if ("verify" in options) {
      this.verify = options["verify"];
    }

    return this.post("search", payload);
  }

  /**
   * @summary Results of a search
   * @description Fetch paginated results of a previously executed search
   * @param {String} id - The id of a successful search
   * @param {number} limit (default 20) - The number of results returned
   * @param {number} offset (default 0) - The starting position of the first returned result
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * const response = await audit.results(pxx_asd0987asdas89a8, 50, 100)
   */
  results(id: string, limit = 20, offset = 0): Promise<PangeaResponse> {
    if (!id) {
      throw new Error("Missing required `id` parameter");
    }

    const payload = {
      id,
      limit,
      offset,
    };

    return this.post("results", payload);
  }

  /**
   * @summary Retrieve tamperproof verification
   * @description Returns current root hash and consistency proof
   * @param {number} size - The size of the tree (the number of records)
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * const response = audit.root(7);
   */
  root(size: number = 0): Promise<PangeaResponse> {
    const data = {};

    if (size > 0) {
      data["tree_size"] = size;
    }

    return this.post("root", data);
  }
}

export default AuditService;