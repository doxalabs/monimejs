import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiListResponse,
  ApiResponse,
  ListPaymentsParams,
  Payment,
  RequestConfig,
  UpdatePaymentInput,
} from "./types";
import {
  validateLimit,
  validatePaymentId,
  validateUpdatePaymentInput,
} from "./validation";

/**
 * Module for managing payments.
 * Payments are created when a customer completes a payment code transaction.
 */
export class PaymentModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Retrieves a payment by ID.
   * @param id - The payment ID (must start with "pay-")
   * @param config - Per-request configuration overrides
   * @returns The payment
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id: string, config?: RequestConfig): Promise<ApiResponse<Payment>> {
    if (this._http_client.shouldValidate) {
      validatePaymentId(id);
    }

    return this._http_client.request<ApiResponse<Payment>>({
      method: "GET",
      path: `/${API_VERSION}/payments/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists payments with optional filtering.
   * @param params - Optional filter and pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of payments
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListPaymentsParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<Payment>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          orderNumber: params.orderNumber,
          financialAccountId: params.financialAccountId,
          financialTransactionReference: params.financialTransactionReference,
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<Payment>>({
      method: "GET",
      path: `/${API_VERSION}/payments`,
      params: query_params,
      config,
    });
  }

  /**
   * Updates a payment.
   * @param id - The payment ID (must start with "pay-")
   * @param input - Fields to update (null values will clear the field)
   * @param config - Per-request configuration overrides
   * @returns The updated payment
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(
    id: string,
    input: UpdatePaymentInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<Payment>> {
    if (this._http_client.shouldValidate) {
      validatePaymentId(id);
      validateUpdatePaymentInput(input);
    }

    return this._http_client.request<ApiResponse<Payment>>({
      method: "PATCH",
      path: `/${API_VERSION}/payments/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }
}
