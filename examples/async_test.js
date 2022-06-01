const PangeaConfig = require("../src/config");
const TestService = require('../src/services/tester');

const token = "USERTOKEN"; // process.env.PANGEA_TOKEN;
const config = new PangeaConfig({ baseDomain: 'dev.pangea.cloud' });
const tester = new TestService(token, config);

(async () => {
  const response = await tester.async_call({ 'echo': 'hello world', 'delay': 5 })
  console.log("RESP", response);
  //console.log('CODE', response.code);
  //console.log('DATA', response.result);
})();
