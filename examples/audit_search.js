const AuditService = require('../src/services/audit');

const audit = new AuditService('USERTOKEN');

(async () => {
  const response = await audit.search("glenn");

  console.log('CODE', response.code);
  console.log('DATA', response.result);
})();
