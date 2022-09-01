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
  export interface LogOptions {
    verbose?: boolean;
  }

  export interface LogData extends Audit.LogOptions {
    event: Audit.Event;
  }

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
    event?: Audit.Event;
    canonical_event_base64?: string;
  }

  export interface SearchOptions {
    limit?: number;
    start?: string;
    end?: string;
    order?: string;
    order_by?: string;
    include_membership_proof?: boolean;
    include_hash?: boolean;
    include_root?: boolean;
    restriction?: Audit.SearchRestriction;
    verify?: boolean;
  }

  export interface SearchResponse {
    id?: string;
    count: number;
    events: Audit.AuditRecord[];
    expires_at?: string;
    root: Root;
  }

  export interface SearchRestriction {
    actor?: Array<string>;
    action?: Array<string>;
    signature?: Array<string>;
    source?: Array<string>;
    status?: Array<string>;
    target?: Array<string>;
  }

  export interface SearchParams {
    query: string;
    limit?: number;
    start?: string;
    end?: string;
    order?: string;
    order_by?: string;
    include_membership_proof?: boolean;
    include_hash?: boolean;
    include_root?: boolean;
    search_restriction?: Audit.SearchRestriction;
  }

  export interface RootParams {
    tree_size?: number;
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

/**
 * Intel services interface definitions
 */
export namespace Intel {
  export interface Options {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
  }

  export interface FileParams extends Intel.Options {
    hash: string;
    hash_type: string;
  }

  export interface IPParams extends Intel.Options {
    ip: string;
  }

  export interface URLParams extends Intel.Options {
    url: string;
  }

  export interface DomainParams extends Intel.Options {
    domain: string;
  }

  export interface Response {
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
  }
}
