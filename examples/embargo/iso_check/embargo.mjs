/* eslint-disable no-console */

import { PangeaConfig, EmbargoService } from "node-pangea";

const token = process.env.EMBARGO_AUTH_TOKEN;
const configId = process.env.EMBARGO_CONFIG_ID;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN, configId });
const embargo = new EmbargoService(token, config);

(async () => {
  const iso_country_code = "CU";
  console.log("Checking Embargo ISO code: '%s'", iso_country_code);

  const response = await embargo.isoCheck(iso_country_code);

  if (response.success) {
    console.log("Response: ", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
