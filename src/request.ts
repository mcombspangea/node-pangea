import got, { Response, OptionsInit } from "got";
import type { Headers } from "got";
import pkg from "../package.json";
import PangeaConfig from "./config";
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

  async post(endpoint: string, data: object): Promise<Response> {
    const url = this.getUrl(endpoint);
    const options: OptionsInit = {
      headers: this.getHeaders(),
      json: data,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    };

    try {
      const apiCall = (await got.post(url, options)) as Response;

      if (apiCall.statusCode === 202 && this.config.queuedRetryEnabled) {
        const body = apiCall.body as ResponseObject<any>;
        const request_id = body?.request_id;
        const response = await this.handleAsync(request_id);
        return response;
      }
      return apiCall;
    } catch (error) {
      return error.response;
    }
  }

  async get(endpoint: string, path: string): Promise<Response> {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;
    const url = this.getUrl(fullPath);

    const options: OptionsInit = {
      headers: this.getHeaders(),
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    };

    try {
      return (await got.get(url, options)) as Response;
    } catch (error) {
      return error.response;
    }
  }

  async handleAsync(requestId: string): Promise<Response> {
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

  setExtraHeaders(headers) {
    this.extraHeaders = { ...headers };
  }

  getUrl(path: string): string {
    const versionPath = this.config.apiVersion ? `/${this.config.apiVersion}` : "";
    const url = `https://${this.serviceName}.${this.config.baseDomain}${versionPath}/${path}`;

    return url;
  }

  getHeaders(): Headers {
    const headers: Headers = {
      "Content-Type": "application/json",
      "User-Agent": `Pangea Node ${pkg.version}`,
      Authorization: `Bearer ${this.token}`,
    };

    if (Object.keys(this.extraHeaders).length > 0) {
      Object.assign(headers, this.extraHeaders);
    }

    return headers;
  }
}

export default PangeaRequest;
