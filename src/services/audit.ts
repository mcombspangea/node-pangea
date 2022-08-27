import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Audit } from "../types.js";
import { PublishedRoots, getArweavePublishedRoots } from "../utils/arweave.js";
import { verifyConsistencyProof, verifyMembershipProof } from "../utils/verification.js";

const SupportedFields = ["actor", "action", "status", "source", "target"];

const SupportedJSONFields = ["message", "new", "old"];

/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends BaseService {
  publishedRoots: PublishedRoots;
  verifyResponse: boolean;

  constructor(token: string, config: PangeaConfig) {
    super("audit", token, config);
    this.publishedRoots = {};
    this.configIdHeaderName = "X-Pangea-Audit-Config-ID";
    this.verifyResponse = false;
    this.publishedRoots = {};
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
   * @param {Object} options - Log options. The following log options are supported:
   *   - verbose (bool): Return a verbose response, including the canonical event hash and created_at time.
   * @returns {Promise} - A promise representing an async call to the log endpoint.
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
  log(content: Audit.Event, options: Audit.LogOptions): Promise<PangeaResponse<Audit.LogResponse>> {
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

    const data: Audit.LogData = { event: event };

    if (options?.verbose) {
      data.verbose = options.verbose
    }

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
  async search(query: string, options = {}): Promise<PangeaResponse<Audit.SearchResponse>> {
    const defaults = {
      limit: 20,
      start: "",
      end: "",
      order: "desc",
      order_by: "received_at",
      include_membership_proof: true,
      include_hash: true,
      include_root: true,
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
      this.verifyResponse = options["verify"];
    }

    const response: PangeaResponse<Audit.SearchResponse> = await this.post("search", payload);

    return this.processSearchResponse(response);
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
  async results(id: string, limit = 20, offset = 0): Promise<PangeaResponse<Audit.ResultResponse>> {
    if (!id) {
      throw new Error("Missing required `id` parameter");
    }

    const payload = {
      id,
      limit,
      offset,
    };

    const response: PangeaResponse<Audit.SearchResponse> = await this.post("results", payload);

    return this.processSearchResponse(response);
  }

  /**
   * @summary Retrieve tamperproof verification
   * @description Returns current root hash and consistency proof
   * @param {number} size - The size of the tree (the number of records)
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * const response = audit.root(7);
   */
  root(size: number = 0): Promise<PangeaResponse<Audit.RootResponse>> {
    const data = {};

    if (size > 0) {
      data["tree_size"] = size;
    }

    return this.post("root", data);
  }

  async processSearchResponse(
    response: PangeaResponse<Audit.SearchResponse>
  ): Promise<PangeaResponse<Audit.SearchResponse>> {
    if (!response.success) {
      return response;
    }

    const root: Audit.Root = response.result.root;
    const localRoot = async (treeSize: number) => {
      const response = await this.root(treeSize);
      const root: Audit.RootResponse = response?.result?.data;
      return root;
    };

    if (!root) {
      // response.result.root = {};
      return response;
    }

    if (this.verifyResponse) {
      if (!root?.tree_name) return;

      const treeName = root?.tree_name;
      const treeSizes = new Set<number>();
      treeSizes.add(root?.size ?? 0);

      response.result.events.forEach((log) => {
        if (log.leaf_index !== undefined) {
          const idx = Number(log.leaf_index);
          treeSizes.add(idx + 1);
          if (idx > 0) {
            treeSizes.add(idx);
          }
        }
      });

      this.publishedRoots = await getArweavePublishedRoots(
        treeName,
        Array.from(treeSizes),
        localRoot
      );

      response.result.events.forEach((record) => {
        if (record.leaf_index) {
          const consistency = verifyConsistencyProof({
            publishedRoots: this.publishedRoots,
            record: record,
          });
          record.event.consistency_proof = consistency ? "pass" : "fail";
        } else {
          record.event.consistency_proof = "none";
        }

        if (record.membership_proof) {
          const membership = verifyMembershipProof({
            root: response.result.root,
            record: record,
          });
          record.event.membership_proof = membership ? "pass" : "fail";
        } else {
          record.event.membership_proof = "none";
        }
      });
    }
    return response;
  }
}

export default AuditService;
