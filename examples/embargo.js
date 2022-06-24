const PangeaConfig = require("../src/config");
const EmbargoService = require("../src/services/embargo");

const token = process.env.PANGEA_TOKEN;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud" });
const embargo = new EmbargoService(token, config);

(async () => {
  const response = await embargo.check("98.35.229.30");
  // eslint-disable-next-line no-console
  console.log("CODE", response?.code);
  // eslint-disable-next-line no-console
  console.log("DATA", response?.result);
})();
