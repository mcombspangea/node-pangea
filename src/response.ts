import type { Response } from "got/dist/source/index";
import { HTTPError, RequestError } from "got";

import type { ResponseObject } from "./types.js";

class PangeaResponse<M> {
  gotResponse: Response | RequestError | undefined;
  success: boolean;
  data: ResponseObject<M> | undefined;
  status: string;
  code: number | string;

  constructor(response: Response | RequestError) {
    this.status = "";
    this.code = 0;
    this.success = false;

    if (response instanceof RequestError) {      
      this.gotResponse = response.response ? response.response as Response : undefined;
      this.success = false;

      if (this.gotResponse) {
        this.status = this.gotResponse.statusMessage || "";
        this.code = this.gotResponse.statusCode;        
        if (this.gotResponse.body instanceof Object) {
          this.data = this.gotResponse.body as ResponseObject<any>;
        }
      } else {
        this.code = response.code;
        this.status = response.message;
        }
    } else if (response) {
      const { statusCode } = response;
      this.gotResponse = response as Response;      
      this.success = (statusCode >= 200 && statusCode <= 299) || statusCode === 304;    
      this.code = statusCode;      

      if (this.gotResponse.body instanceof Object) {
        this.data = this.gotResponse.body as ResponseObject<any>;
      }
    }    

    
  }

  get result(): any {
    return this.data?.result || {};
  }

  get requestId(): string {
    return this.data?.request_id || "";
  }
}

export default PangeaResponse;
