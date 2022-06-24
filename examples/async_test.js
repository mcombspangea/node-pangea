const PangeaConfig = require("../src/config");
const TestService = require("../src/services/tester");

const token = "USERTOKEN"; // process.env.PANGEA_TOKEN;
const config = new PangeaConfig({ baseDomain: "dev.pangea.cloud" });
const tester = new TestService(token, config);

(async () => {
  const response = await tester.asyncCall({ echo: "hello world", delay: 5 });

  // eslint-disable-next-line no-console
  console.log("RESP", response);
})();
