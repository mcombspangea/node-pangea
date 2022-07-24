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

/**
 * Secure Audit interface definitions
 */
export namespace Audit {
  export interface AuditRecord {
    id?: number;
    message: string;
    actor?: string;
    action?: string;
    new?: string;
    old?: string;
    status?: string;
    target?: string;
    received_at?: string;
    source?: string;
    leaf_index?: string;
    membership_proof?: string;
    hash?: string;
  }

  export interface Root {
    url: string;
    published_at: string;
    size: number;
    root_hash: string;
    consistency_proof: string[];
    tree_name: string;
  }

  export interface SearchResponse {
    id: string;
    count: number;
    events: AuditRecord[];
    expires_at: string;
    root: Root;
  }

  export interface ResultResponse {
    events: AuditRecord[];
    count: number;
    root: Root;
  }

  export interface RootRequest {
    tree_size?: number;
  }

  export interface RootResponse extends Root {}
}
