import type { ConfigOptions } from "./types.js";

class PangeaConfig {
  domain: string = "pangea.cloud";
  environment: string = "production";
  configId: string;
  requestRetries: number = 3;
  requestTimeout: number = 5000;
  queuedRetryEnabled: boolean = true;
  queuedRetries: number = 4;
  apiVersion: string = "v1";

  constructor(options?: ConfigOptions) {
    Object.keys(options).forEach((name) => {
      console.log('SET', name, options[name]);
      this[name] = options[name];
    });
  }
}

export default PangeaConfig;
