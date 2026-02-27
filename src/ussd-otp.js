import {
  CreateUssdOtpInputSchema,
  IdSchema,
  LimitSchema,
  validate,
} from "./validation.js";

/** @typedef {import("./http-client.js").MonimeHttpClient} MonimeHttpClient */
/** @typedef {import("./index.d.ts").ApiDeleteResponse} ApiDeleteResponse */
/** @typedef {import("./index.d.ts").ApiListResponse<import("./index.d.ts").UssdOtp>} UssdOtpListResponse */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").UssdOtp>} UssdOtpResponse */
/** @typedef {import("./index.d.ts").CreateUssdOtpInput} CreateUssdOtpInput */
/** @typedef {import("./index.d.ts").ListUssdOtpsParams} ListUssdOtpsParams */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */

class UssdOtpModule {
  /** @type {MonimeHttpClient} */
  http_client;

  /** @param {MonimeHttpClient} http_client */
  constructor(http_client) {
    this.http_client = http_client;
  }
  /**
   * Creates a new USSD OTP verification request.
   * @param {CreateUssdOtpInput} input - OTP configuration including phone number
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<UssdOtpResponse>} The created USSD OTP with dial code
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(input, config) {
    if (this.http_client.should_validate) {
      validate(CreateUssdOtpInputSchema, input);
    }
    return this.http_client.request({
      method: "POST",
      path: "/ussd-otps",
      body: input,
      config,
    });
  }
  /**
   * Retrieves a USSD OTP by ID.
   * @param {string} id - The USSD OTP ID (must start with "uop-")
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<UssdOtpResponse>} The USSD OTP
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
    }
    return this.http_client.request({
      method: "GET",
      path: `/ussd-otps/${encodeURIComponent(id)}`,
      config,
    });
  }
  /**
   * Lists USSD OTPs with optional pagination.
   * @param {ListUssdOtpsParams} [params] - Optional pagination parameters
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<UssdOtpListResponse>} A paginated list of USSD OTPs
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(params, config) {
    if (this.http_client.should_validate && params?.limit !== void 0) {
      validate(LimitSchema, params.limit);
    }
    const query_params = params
      ? {
          limit: params.limit,
          after: params.after,
        }
      : void 0;
    return this.http_client.request({
      method: "GET",
      path: "/ussd-otps",
      params: query_params,
      config,
    });
  }
  /**
   * Deletes a USSD OTP.
   * @param {string} id - The USSD OTP ID (must start with "uop-")
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<ApiDeleteResponse>} Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
    }
    return this.http_client.request({
      method: "DELETE",
      path: `/ussd-otps/${encodeURIComponent(id)}`,
      config,
    });
  }
}
export { UssdOtpModule };
