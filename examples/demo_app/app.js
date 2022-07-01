const DB = require('./db')

const PangeaConfig = require('../../src/config');
const EmbargoService = require('../../src/services/embargo');

const token = process.env.PANGEA_TOKEN;
const embargo_config_id = process.env.EMBARGO_CONFIG_ID;
const audit_config_id = process.env.AUDIT_CONFIG_ID;
const redact_config_id = process.env.REDACT_CONFIG_ID;

const embargo_config = new PangeaConfig({ baseDomain: "dev.pangea.cloud", configId: embargo_config_id });
const embargo = new EmbargoService(token, embargo_config);

class App {
  constructor() {
    this.store = new DB();
  }

  shutdown() {
    this.store.shutdown()
  }

  async setup() {
    console.log(`[App.setup]`)
    return await this.store.setupEmployeeTable()
  }

  async upload_resume(user, client_ip, data) {
    // Embargo check
    const response = await embargo.check(client_ip);

    console.log(response?.code, response?.result);
    
    let code = 201;
    let message = "Resume accepted";

    return [code, message]
  }
}

module.exports = App
