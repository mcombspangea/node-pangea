/* eslint-disable no-console */

import PangeaConfig from "../src/config";
import EmbargoService from "../src/services/embargo";

const token = process.env.PANGEA_TOKEN;
const configId = process.env.EMBARGO_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId });
const embargo = new EmbargoService(token, config);

(async () => {
  const response = await embargo.ipCheck("213.24.238.26");

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
