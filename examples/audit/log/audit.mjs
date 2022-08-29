import { PangeaConfig, AuditService } from "node-pangea";

const token = process.env.AUDIT_AUTH_TOKEN;
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN, configId });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    message: "Hello, World!",
  };

  console.log("Logging message: ", data.message);
  const logResponse = await audit.log(data);

  if (logResponse.success) {
    console.log("Response: ", logResponse.result);
  } else {
    console.log("Error", logResponse.code, logResponse.result);
  }
})();
