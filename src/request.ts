import got, { Options, RequestError } from "got";
import type { Response, Headers } from "got/dist/source";
import PangeaConfig, { version } from "./config";
import { ResponseObject } from "./types";

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

class PangeaRequest {
  serviceName: string;
  token: string;
  config: PangeaConfig;
  extraHeaders: Object;

  constructor(serviceName: string, token: string, config: PangeaConfig) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = config;
    this.extraHeaders = {};
  }

  async post(endpoint: string, data: object): Promise<Response<any> | RequestError> {
    const options: Options = {
      url: this.getUrl(endpoint),
      headers: this.getHeaders(),
      json: data,
      retry: this.config.requestRetries,
      responseType: "json",
    };

    try {
      const apiCall = (await got.post(options)) as Response;

      if (apiCall.statusCode === 202 && this.config.queuedRetryEnabled) {
        const body = apiCall.body as ResponseObject<any>;
        const request_id = body?.request_id;
        const response = (await this.handleAsync(request_id)) as Response;
        return response;
      }
      return apiCall;
    } catch (error) {
      // throw new Error(error as string);
      return error as RequestError;
    }
  }

  async get(endpoint: string, path: string): Promise<Response<any> | RequestError> {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;

    const options: Options = {
      url: this.getUrl(fullPath),
      headers: this.getHeaders(),
      retry: this.config.requestRetries,
      responseType: "json",
    };

    try {
      return (await got.get(options)) as Response;
    } catch (error) {
      // throw new Error(error as string);
      return error as RequestError;
    }
  }

  async handleAsync(requestId: string): Promise<Response<any> | undefined> {
    let retryCount = 0;

    while (retryCount < this.config.queuedRetries) {
      retryCount += 1;
      const waitTime = retryCount * retryCount * 500;

      // eslint-disable-next-line no-await-in-loop
      await delay(waitTime);
      // eslint-disable-next-line no-await-in-loop
      const response = (await this.get("request", requestId)) as Response;

      if (!(response.statusCode === 202 && retryCount < this.config.queuedRetries)) {
        return response;
      }
    }

    // this should never be reached
    return;
  }

  setExtraHeaders(headers: any): any {
    this.extraHeaders = { ...headers };
  }

  getUrl(path: string): string {
    const versionPath = this.config.apiVersion ? `/${this.config.apiVersion}` : "";
    const url = `https://${this.serviceName}.${this.config.domain}${versionPath}/${path}`;

    return url;
  }

  getHeaders(): Headers {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": `Pangea Node ${version}`,
      Authorization: `Bearer ${this.token}`,
    };

    if (Object.keys(this.extraHeaders).length > 0) {
      Object.assign(headers, this.extraHeaders);
    }

    return headers;
  }
}

export default PangeaRequest;
