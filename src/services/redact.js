const BaseService = require("./base");

const ConfigIdHeaderName = "X-Pangea-Redact-Config-ID";
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

  redact(param) {
    const data = { param };

    return this.post("redact", data);
  }

  redactStructured(param) {
    const input = { data: param };

    return this.post("redact_structured", input);
  }
}

module.exports = RedactService;
