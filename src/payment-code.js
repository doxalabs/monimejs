import {
  CreatePaymentCodeInputSchema,
  IdSchema,
  LimitSchema,
  UpdatePaymentCodeInputSchema,
  validate,
} from "./validation.js";

/** @typedef {import("./http-client.js").MonimeHttpClient} MonimeHttpClient */
/** @typedef {import("./index.d.ts").ApiDeleteResponse} ApiDeleteResponse */
/** @typedef {import("./index.d.ts").ApiListResponse<import("./index.d.ts").PaymentCode>} PaymentCodeListResponse */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").PaymentCode>} PaymentCodeResponse */
/** @typedef {import("./index.d.ts").CreatePaymentCodeInput} CreatePaymentCodeInput */
/** @typedef {import("./index.d.ts").ListPaymentCodesParams} ListPaymentCodesParams */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */
/** @typedef {import("./index.d.ts").UpdatePaymentCodeInput} UpdatePaymentCodeInput */

class PaymentCodeModule {
  /** @type {MonimeHttpClient} */
  http_client;

  /** @param {MonimeHttpClient} http_client */
  constructor(http_client) {
    this.http_client = http_client;
  }
  /**
   * Creates a new payment code.
   * @param {CreatePaymentCodeInput} input - Payment code configuration
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<PaymentCodeResponse>} The created payment code
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(input, config) {
    if (this.http_client.should_validate) {
      validate(CreatePaymentCodeInputSchema, input);
    }
    return this.http_client.request({
      method: "POST",
      path: "/payment-codes",
      body: input,
      config,
    });
  }
  /**
   * Retrieves a payment code by ID.
   * @param {string} id - The payment code ID
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<PaymentCodeResponse>} The payment code
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
    }
    return this.http_client.request({
      method: "GET",
      path: `/payment-codes/${encodeURIComponent(id)}`,
      config,
    });
  }
  /**
   * Lists payment codes with optional filtering and pagination.
   * @param {ListPaymentCodesParams} [params] - Optional filter and pagination parameters
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<PaymentCodeListResponse>} A paginated list of payment codes
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(params, config) {
    if (this.http_client.should_validate && params?.limit !== void 0) {
      validate(LimitSchema, params.limit);
    }
    const query_params = params
      ? {
          ussd_code: params.ussd_code,
          mode: params.mode,
          status: params.status,
          limit: params.limit,
          after: params.after,
        }
      : void 0;
    return this.http_client.request({
      method: "GET",
      path: "/payment-codes",
      params: query_params,
      config,
    });
  }
  /**
   * Updates a payment code.
   * @param {string} id - The payment code ID
   * @param {UpdatePaymentCodeInput} input - Fields to update
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<PaymentCodeResponse>} The updated payment code
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(id, input, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
      validate(UpdatePaymentCodeInputSchema, input);
    }
    return this.http_client.request({
      method: "PATCH",
      path: `/payment-codes/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }
  /**
   * Deletes a payment code.
   * @param {string} id - The payment code ID
   * @param {RequestConfig} [config] - Optional request configuration
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
      path: `/payment-codes/${encodeURIComponent(id)}`,
      config,
    });
  }
}
export { PaymentCodeModule };
