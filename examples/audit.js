const PangeaConfig = require("../src/config");
const AuditService = require('../src/services/audit');

const token = process.env.PANGEA_TOKEN;
const config = new PangeaConfig({ baseDomain: 'dev.pangea.cloud' });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    "actor": "pangea",
    "action": "update",
    "status": "success",
    "message": "node-sdk test message"
  };
  const log_response = await audit.log(data);

  console.log('CODE', log_response.code);
  console.log('DATA', log_response.result);

  const search_response = await audit.search("reboot");

  console.log('CODE', search_response.code);
  console.log('DATA', search_response.result);
})();
