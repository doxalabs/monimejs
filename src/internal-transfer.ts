import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiDeleteResponse,
  ApiListResponse,
  ApiResponse,
  CreateInternalTransferInput,
  InternalTransfer,
  ListInternalTransfersParams,
  RequestConfig,
  UpdateInternalTransferInput,
} from "./types";
import {
  validateCreateInternalTransferInput,
  validateInternalTransferId,
  validateLimit,
  validateUpdateInternalTransferInput,
} from "./validation";

/**
 * Module for managing internal transfers.
 * Internal transfers move funds between financial accounts within the same space.
 */
export class InternalTransferModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Creates a new internal transfer.
   * @param input - Transfer configuration including amount and accounts
   * @param idempotencyKey - Optional key to prevent duplicate requests
   * @param config - Per-request configuration overrides
   * @returns The created internal transfer
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(
    input: CreateInternalTransferInput,
    idempotencyKey?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<InternalTransfer>> {
    if (this._http_client.shouldValidate) {
      validateCreateInternalTransferInput(input);
    }

    return this._http_client.request<ApiResponse<InternalTransfer>>({
      method: "POST",
      path: `/${API_VERSION}/internal-transfers`,
      body: input,
      idempotencyKey,
      config,
    });
  }

  /**
   * Retrieves an internal transfer by ID.
   * @param id - The internal transfer ID (must start with "trn-")
   * @param config - Per-request configuration overrides
   * @returns The internal transfer
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(
    id: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<InternalTransfer>> {
    if (this._http_client.shouldValidate) {
      validateInternalTransferId(id);
    }

    return this._http_client.request<ApiResponse<InternalTransfer>>({
      method: "GET",
      path: `/${API_VERSION}/internal-transfers/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists internal transfers with optional filtering.
   * @param params - Optional filter and pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of internal transfers
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListInternalTransfersParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<InternalTransfer>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          status: params.status,
          sourceFinancialAccountId: params.sourceFinancialAccountId,
          destinationFinancialAccountId: params.destinationFinancialAccountId,
          financialTransactionReference: params.financialTransactionReference,
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<InternalTransfer>>({
      method: "GET",
      path: `/${API_VERSION}/internal-transfers`,
      params: query_params,
      config,
    });
  }

  /**
   * Updates an internal transfer.
   * @param id - The internal transfer ID (must start with "trn-")
   * @param input - Fields to update (null values will clear the field)
   * @param config - Per-request configuration overrides
   * @returns The updated internal transfer
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(
    id: string,
    input: UpdateInternalTransferInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<InternalTransfer>> {
    if (this._http_client.shouldValidate) {
      validateInternalTransferId(id);
      validateUpdateInternalTransferInput(input);
    }

    return this._http_client.request<ApiResponse<InternalTransfer>>({
      method: "PATCH",
      path: `/${API_VERSION}/internal-transfers/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }

  /**
   * Deletes an internal transfer.
   * @param id - The internal transfer ID (must start with "trn-")
   * @param config - Per-request configuration overrides
   * @returns Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id: string, config?: RequestConfig): Promise<ApiDeleteResponse> {
    if (this._http_client.shouldValidate) {
      validateInternalTransferId(id);
    }

    return this._http_client.request<ApiDeleteResponse>({
      method: "DELETE",
      path: `/${API_VERSION}/internal-transfers/${encodeURIComponent(id)}`,
      config,
    });
  }
}
