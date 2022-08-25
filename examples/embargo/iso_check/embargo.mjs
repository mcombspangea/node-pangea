/* eslint-disable no-console */

import { PangeaConfig, EmbargoService } from "node-pangea";

const token = process.env.EMBARGO_AUTH_TOKEN;
const configId = process.env.EMBARGO_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: process.env.PANGEA_DOMAIN, configId });
const embargo = new EmbargoService(token, config);

(async () => {
  const response = await embargo.isoCheck("CU");

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
