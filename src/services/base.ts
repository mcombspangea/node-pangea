import PangeaConfig from "../config";
import PangeaRequest from "../request";
import PangeaResponse from "../response";

class BaseService {
  configIdHeaderName: string;
  serviceName: string;
  token: string;
  config: PangeaConfig;
  request: PangeaRequest;

  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
    - responseClass: a custom Response handler class, defaults to PangeaResponse
  */
  constructor(serviceName, token, config) {
    if (!serviceName) throw new Error("A serviceName is required");

    this.configIdHeaderName = "";

    this.serviceName = serviceName;
    this.token = token || "";

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

  async get(endpoint: string, path: string): Promise<PangeaResponse> {
    const gotResponse = await this.request.get(endpoint, path);

    return new PangeaResponse(gotResponse);
  }

  async post(endpoint: string, data: object): Promise<PangeaResponse> {
    const gotResponse = await this.request.post(endpoint, data);

    return new PangeaResponse(gotResponse);
  }
}

export default BaseService;
