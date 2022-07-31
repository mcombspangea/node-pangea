import type { Response } from "got/dist/source";
import { HTTPError } from "got/dist/source";
import type { ResponseObject } from "./types";

class PangeaResponse<M> {
  gotResponse: Response;
  success: boolean;
  data: ResponseObject<M> | undefined;
  status: string;
  code: number;

  constructor(response: Response | HTTPError) {
    if (response instanceof HTTPError) {
      this.gotResponse = response.response;
      this.success = false;
    } else {
      const { statusCode } = response;
      this.gotResponse = response;
      this.success = (statusCode >= 200 && statusCode <= 299) || statusCode === 304;
    }

    this.status = this.gotResponse.statusMessage || "";
    this.code = this.gotResponse.statusCode || 0;

    if (this.gotResponse.body instanceof Object) {
      this.data = this.gotResponse.body as ResponseObject<any>;
    }
  }

  get result(): M {
    return this.data?.result;
  }

  get requestId(): string {
    return this.data?.request_id;
  }
}

export default PangeaResponse;
