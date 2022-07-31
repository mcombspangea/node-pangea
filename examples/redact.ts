/* eslint-disable no-console */

import PangeaConfig from "../src/config";
import RedactService from "../src/services/redact";

const token = process.env.PANGEA_TOKEN;
const configId = process.env.REDACT_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId });
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
