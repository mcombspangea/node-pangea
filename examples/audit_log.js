const AuditService = require('../src/services/audit');

const audit = new AuditService('USERTOKEN');

(async () => {
  const data = {
    "actor": "pangea",
    "action": "update",
    "status": "success"
  };
  const response = await audit.log(data);

  console.log('CODE', response.code);
  console.log('DATA', response.result);
})();
