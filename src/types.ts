/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  baseDomain?: string;
  environment?: string;
  configId?: string;
  requestRetries?: number;
  requestTimeout?: number;
  queuedRetryEnabled?: boolean;
  aqueuedRetries?: number;
  apiVersion?: string;
}

/**
 * Pangea Response object
 */

export interface ResponseObject {
  request_id: string;
  request_time: string;
  status_code: number;
  status: string;
  result: JSON;
  summary: string;
}
