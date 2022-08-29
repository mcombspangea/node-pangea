/* eslint-disable no-console */

import { PangeaConfig, RedactService } from "node-pangea";

const token = process.env.REDACT_AUTH_TOKEN;
const configId = process.env.REDACT_CONFIG_ID;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN, configId });
const redact = new RedactService(token, config);

(async () => {
  const text = "Hello, my phone number is 123-456-7890";
  console.log("Redacting PII from: '%s'", text);
  const response = await redact.redact(text);

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
