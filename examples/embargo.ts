/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.

 % ts-node-esm embargo.ts
*/

import PangeaConfig from "../src/config.js";
import EmbargoService from "../src/services/embargo.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN || "";
const configId = process.env.EMBARGO_CONFIG_ID;
const config = new PangeaConfig({ domain, configId });
const embargo = new EmbargoService(token, config);

(async () => {
  const response = await embargo.ipCheck("213.24.238.26");

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();

(async () => {
  const response = await embargo.isoCheck("CU");

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
