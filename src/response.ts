import type { Response } from "got/dist/source/index";
import { HTTPError, RequestError } from "got";
import type { ResponseObject } from "./types";

class PangeaResponse<M> {
  gotResponse: Response | undefined;
  success: boolean;
  data: ResponseObject<M> | undefined;
  status: string;
  code: number;

  constructor(response: Response | HTTPError | RequestError) {
    this.status = "";
    this.code = 0;
    this.success = false;

    if (response instanceof RequestError) {
      this.gotResponse = response.response as Response;
      this.success = false;
      this.status = this.gotResponse.statusMessage || "";
      this.code = this.gotResponse.statusCode || 0;
    } else if (response) {
      const { statusCode } = response as Response;
      this.gotResponse = response as Response;
      this.success = (statusCode >= 200 && statusCode <= 299) || statusCode === 304;

      this.status = this.gotResponse.statusMessage || "";
      this.code = this.gotResponse.statusCode || 0;

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
