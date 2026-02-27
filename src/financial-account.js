import {
  CreateFinancialAccountInputSchema,
  IdSchema,
  LimitSchema,
  UpdateFinancialAccountInputSchema,
  validate,
} from "./validation.js";

/** @typedef {import("./http-client.js").MonimeHttpClient} MonimeHttpClient */
/** @typedef {import("./index.d.ts").ApiListResponse<import("./index.d.ts").FinancialAccount>} FinancialAccountListResponse */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").FinancialAccount>} FinancialAccountResponse */
/** @typedef {import("./index.d.ts").CreateFinancialAccountInput} CreateFinancialAccountInput */
/** @typedef {import("./index.d.ts").GetFinancialAccountParams} GetFinancialAccountParams */
/** @typedef {import("./index.d.ts").ListFinancialAccountsParams} ListFinancialAccountsParams */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */
/** @typedef {import("./index.d.ts").UpdateFinancialAccountInput} UpdateFinancialAccountInput */

class FinancialAccountModule {
  /** @type {MonimeHttpClient} */
  http_client;

  /** @param {MonimeHttpClient} http_client */
  constructor(http_client) {
    this.http_client = http_client;
  }
  /**
   * Creates a new financial account.
   * @param {CreateFinancialAccountInput} input - Financial account configuration including name and currency
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<FinancialAccountResponse>} The created financial account
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(input, config) {
    if (this.http_client.should_validate) {
      validate(CreateFinancialAccountInputSchema, input);
    }
    return this.http_client.request({
      method: "POST",
      path: "/financial-accounts",
      body: input,
      config,
    });
  }
  /**
   * Retrieves a financial account by ID.
   * @param {string} id - The financial account ID (must start with "fa-")
   * @param {GetFinancialAccountParams} [params] - Optional parameters
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<FinancialAccountResponse>} The financial account
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id, params, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
    }
    const query_params = params
      ? {
          withBalance: params.withBalance,
        }
      : void 0;
    return this.http_client.request({
      method: "GET",
      path: `/financial-accounts/${encodeURIComponent(id)}`,
      params: query_params,
      config,
    });
  }
  /**
   * Lists financial accounts with optional filtering.
   * @param {ListFinancialAccountsParams} [params] - Optional filter and pagination parameters
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<FinancialAccountListResponse>} A paginated list of financial accounts
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(params, config) {
    if (this.http_client.should_validate && params?.limit !== void 0) {
      validate(LimitSchema, params.limit);
    }
    const query_params = params
      ? {
          uvan: params.uvan,
          reference: params.reference,
          withBalance: params.withBalance,
          limit: params.limit,
          after: params.after,
        }
      : void 0;
    return this.http_client.request({
      method: "GET",
      path: "/financial-accounts",
      params: query_params,
      config,
    });
  }
  /**
   * Updates a financial account.
   * @param {string} id - The financial account ID (must start with "fa-")
   * @param {UpdateFinancialAccountInput} input - Fields to update
   * @param {RequestConfig} [config] - Optional request configuration (timeout, idempotencyKey, signal)
   * @returns {Promise<FinancialAccountResponse>} The updated financial account
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(id, input, config) {
    if (this.http_client.should_validate) {
      validate(IdSchema, id);
      validate(UpdateFinancialAccountInputSchema, input);
    }
    return this.http_client.request({
      method: "PATCH",
      path: `/financial-accounts/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }
}
export { FinancialAccountModule };
