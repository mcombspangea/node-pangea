/* eslint-disable no-console */

import PangeaConfig from "../src/config.js";
import RedactService from "../src/services/redact.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN;
const configId = process.env.REDACT_CONFIG_ID;
const config = new PangeaConfig({ domain, configId });
const redact = new RedactService(token, config);

(async () => {
  const response = await redact.redact("Jenny Jenny... 415-867-5309");

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();

(async () => {
  const response = await redact.redactStructured({ phone: "415-867-5309" });

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
