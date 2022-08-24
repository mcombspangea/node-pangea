/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  domain?: string;
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

export interface ResponseObject<M> {
  request_id: string;
  request_time: string;
  status_code: number;
  status: string;
  result: M;
  summary: string;
}

/**
 * Secure Audit interface definitions
 */
export namespace Audit {
  export interface Event {
    message: string;
    actor?: string;
    action?: string;
    new?: string;
    old?: string;
    status?: string;
    target?: string;
    received_at?: string;
    source?: string;
    consistency_proof?: string;
    membership_proof?: string;
  }

  export interface AuditRecord {
    id?: number;
    leaf_index?: string;
    membership_proof?: string;
    hash?: string;
    event: Event;
  }

  export interface Root {
    url: string;
    published_at: string;
    size: number;
    root_hash: string;
    consistency_proof: string[];
    tree_name: string;
  }

  export interface LogResponse {
    hash: string;
  }

  export interface SearchResponse {
    id?: string;
    count: number;
    events: AuditRecord[];
    expires_at?: string;
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

  export interface RootResponse extends Root {
    data?: Root;
  }
}

export namespace Redact {
  export interface BaseResponse {
    redacted_data: string;
  }

  export interface StructuredResponse {
    redacted_data: object;
  }
}

export namespace Embargo {
  export interface Sanction {
    list_name: string;
    embargoed_country_name: string;
    embargoed_country_iso_code: string;
    issuing_country: string;
    annotations: object;
  }

  export interface CheckResponse {
    sanctions: Sanction[];
  }
}
