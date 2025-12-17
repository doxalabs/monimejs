import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiDeleteResponse,
  ApiListResponse,
  ApiResponse,
  CreatePayoutInput,
  ListPayoutsParams,
  Payout,
  RequestConfig,
  UpdatePayoutInput,
} from "./types";
import {
  validateCreatePayoutInput,
  validateLimit,
  validatePayoutId,
  validateUpdatePayoutInput,
} from "./validation";

/**
 * Module for managing payouts.
 * Payouts are used to transfer funds to external accounts (bank, mobile money, wallet).
 */
export class PayoutModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Creates a new payout.
   * @param input - Payout configuration including amount and destination
   * @param idempotencyKey - Optional key to prevent duplicate requests
   * @param config - Per-request configuration overrides
   * @returns The created payout
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(
    input: CreatePayoutInput,
    idempotencyKey?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<Payout>> {
    if (this._http_client.shouldValidate) {
      validateCreatePayoutInput(input);
    }

    return this._http_client.request<ApiResponse<Payout>>({
      method: "POST",
      path: `/${API_VERSION}/payouts`,
      body: input,
      idempotencyKey,
      config,
    });
  }

  /**
   * Retrieves a payout by ID.
   * @param id - The payout ID (must start with "pot-")
   * @param config - Per-request configuration overrides
   * @returns The payout
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id: string, config?: RequestConfig): Promise<ApiResponse<Payout>> {
    if (this._http_client.shouldValidate) {
      validatePayoutId(id);
    }

    return this._http_client.request<ApiResponse<Payout>>({
      method: "GET",
      path: `/${API_VERSION}/payouts/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists payouts with optional filtering.
   * @param params - Optional filter and pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of payouts
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListPayoutsParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<Payout>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          status: params.status,
          sourceFinancialAccountId: params.sourceFinancialAccountId,
          sourceTransactionReference: params.sourceTransactionReference,
          destinationTransactionReference:
            params.destinationTransactionReference,
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<Payout>>({
      method: "GET",
      path: `/${API_VERSION}/payouts`,
      params: query_params,
      config,
    });
  }

  /**
   * Updates a payout.
   * @param id - The payout ID (must start with "pot-")
   * @param input - Fields to update (null values will clear the field)
   * @param config - Per-request configuration overrides
   * @returns The updated payout
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(
    id: string,
    input: UpdatePayoutInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<Payout>> {
    if (this._http_client.shouldValidate) {
      validatePayoutId(id);
      validateUpdatePayoutInput(input);
    }

    return this._http_client.request<ApiResponse<Payout>>({
      method: "PATCH",
      path: `/${API_VERSION}/payouts/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }

  /**
   * Deletes a payout.
   * @param id - The payout ID (must start with "pot-")
   * @param config - Per-request configuration overrides
   * @returns Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id: string, config?: RequestConfig): Promise<ApiDeleteResponse> {
    if (this._http_client.shouldValidate) {
      validatePayoutId(id);
    }

    return this._http_client.request<ApiDeleteResponse>({
      method: "DELETE",
      path: `/${API_VERSION}/payouts/${encodeURIComponent(id)}`,
      config,
    });
  }
}
