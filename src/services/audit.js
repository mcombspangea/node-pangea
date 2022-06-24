const BaseService = require("./base");

const ConfigIdHeaderName = "X-Pangea-Audit-Config-ID";

const SupportedFields = ["actor", "action", "status", "source", "target"];

const SupportedJSONFields = ["message", "new", "old"];

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
