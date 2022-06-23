const PangeaConfig = require("../src/config");
const AuditService = require('../src/services/audit');

const token = process.env.PANGEA_TOKEN;
const configId = process.env.AUDIT_CONFIG_ID;
const config = new PangeaConfig({ baseDomain: 'dev.pangea.cloud', configId: configId });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    "actor": "pangea",
    "action": "update",
    "status": "success",
    "message": "node-sdk test message"
  };

  console.log('Logging audit data...')
  const log_response = await audit.log(data);

  if (log_response.success) {
    console.log('Success:', log_response.result);
  } else {
    console.log("Error", log_response.code, log_response.result);
  }

  console.log('Searching audit data...')
  const search_response = await audit.search("success");

  if (search_response.success) {
    console.log('Status', search_response.code);
    console.log('Events', search_response.result.events);
  } else {
    console.log("Error", log_response.code, log_response.result);
  }
  
})();
