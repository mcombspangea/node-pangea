import PangeaConfig from "../config.js";
import PangeaRequest from "../request.js";
import PangeaResponse from "../response.js";

class BaseService {  
  serviceName: string;  
  token: string;
  configIdHeaderName: string;
  apiVersion: string;
  config: PangeaConfig;
  request: PangeaRequest;

  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
  */
  constructor(serviceName: string, token: string, config: PangeaConfig) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.configIdHeaderName = "";

    this.serviceName = serviceName;
    this.apiVersion = "v1";
    this.token = token;

    this.config = config || new PangeaConfig();
    this.request = new PangeaRequest(this.serviceName, this.token, this.config);
  }

  /*
  The init function should be called by any service implementations to initialize custom headers
  */
  init(): void {
    if (this.config.configId && this.configIdHeaderName) {
      const configIdHeader = {
        [this.configIdHeaderName]: this.config.configId,
      };
      this.request.setExtraHeaders(configIdHeader);
    }
  }

  async get(endpoint: string, path: string): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${path}`;
    const gotResponse = await this.request.get(endpoint, fullpath);

    return new PangeaResponse(gotResponse);
  }

  async post(endpoint: string, data: object): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    const gotResponse = await this.request.post(fullpath, data);

    return new PangeaResponse(gotResponse);
  }
}

export default BaseService;
