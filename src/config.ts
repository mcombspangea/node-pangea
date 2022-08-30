import type { ConfigOptions } from "./types.js";

export const version = "0.3.1";

class PangeaConfig {
  domain: string = "pangea.cloud";
  environment: string = "production";
  configId: string = "";
  requestRetries: number = 3;
  requestTimeout: number = 5000;
  queuedRetryEnabled: boolean = true;
  queuedRetries: number = 4;
  apiVersion: string = "v1";

  constructor(options?: ConfigOptions) {
    Object.assign(this, options);
  }
}

export default PangeaConfig;
