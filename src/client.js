const PangeaConfig = require("./config");
const AuditService = require("./services/audit");
const RedactService = require("./services/redact");
const EmbargoService = require("./services/embargo");

class PangeaClient {
  constructor(token, config) {
    this.token = token;
    this.config = config || new PangeaConfig();

    // service references
    this.auditService = null;
    this.redactService = null;
    this.embargoService = null;
  }

  // TODO: auto-generate these wrappers
  audit(token, config) {
    const auditToken = token || this.token;
    const auditConfig = config || this.config;

    if (!this.auditService) {
      this.auditService = new AuditService(auditToken, auditConfig);
    }

    return this.auditService;
  }

  redact(token, config) {
    const redactToken = token || this.token;
    const redactConfig = config || this.config;

    if (!this.redactService) {
      this.redactService = new RedactService(redactToken, redactConfig);
    }

    return this.redactService;
  }

  embargo(token, config) {
    const embargoToken = token || this.token;
    const embargoConfig = config || this.config;

    if (!this.embargoService) {
      this.embargoService = new EmbargoService(embargoToken, embargoConfig);
    }

    return this.embargoService;
  }
}

module.exports = PangeaClient;
