const PangeaConfig = require("../src/config");
const AuditService = require("../src/services/audit");

const token = process.env.PANGEA_TOKEN;
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    actor: "pangea",
    action: "update",
    status: "success",
    message: "node-sdk test message",
  };

  // eslint-disable-next-line no-console
  console.log("Logging audit data...");
  const logResponse = await audit.log(data);

  if (logResponse.success) {
    // eslint-disable-next-line no-console
    console.log("Success:", logResponse.result);
  } else {
    // eslint-disable-next-line no-console
    console.log("Error", logResponse.code, logResponse.result);
  }

  // eslint-disable-next-line no-console
  console.log("Searching audit data...");
  const searchResponse = await audit.search("success");

  if (searchResponse.success) {
    // eslint-disable-next-line no-console
    console.log("Status", searchResponse.code);
    // eslint-disable-next-line no-console
    console.log("Events", searchResponse.result.events);
  } else {
    // eslint-disable-next-line no-console
    console.log("Error", searchResponse.code, searchResponse.result);
  }
})();
