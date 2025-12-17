import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiDeleteResponse,
  ApiListResponse,
  ApiResponse,
  CheckoutSession,
  CreateCheckoutSessionInput,
  ListCheckoutSessionsParams,
  RequestConfig,
} from "./types";
import {
  validateCheckoutSessionId,
  validateCreateCheckoutSessionInput,
  validateLimit,
} from "./validation";

/**
 * Module for managing checkout sessions.
 * Checkout sessions provide a hosted payment page for collecting payments.
 */
export class CheckoutSessionModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Creates a new checkout session.
   * @param input - Checkout session configuration including line items
   * @param idempotencyKey - Optional key to prevent duplicate requests
   * @param config - Per-request configuration overrides
   * @returns The created checkout session with redirect URL
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(
    input: CreateCheckoutSessionInput,
    idempotencyKey?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<CheckoutSession>> {
    if (this._http_client.shouldValidate) {
      validateCreateCheckoutSessionInput(input);
    }

    return this._http_client.request<ApiResponse<CheckoutSession>>({
      method: "POST",
      path: `/${API_VERSION}/checkout-sessions`,
      body: input,
      idempotencyKey,
      config,
    });
  }

  /**
   * Retrieves a checkout session by ID.
   * @param id - The checkout session ID (must start with "cos-")
   * @param config - Per-request configuration overrides
   * @returns The checkout session
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(
    id: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<CheckoutSession>> {
    if (this._http_client.shouldValidate) {
      validateCheckoutSessionId(id);
    }

    return this._http_client.request<ApiResponse<CheckoutSession>>({
      method: "GET",
      path: `/${API_VERSION}/checkout-sessions/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists checkout sessions with optional pagination.
   * @param params - Optional pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of checkout sessions
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListCheckoutSessionsParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<CheckoutSession>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<CheckoutSession>>({
      method: "GET",
      path: `/${API_VERSION}/checkout-sessions`,
      params: query_params,
      config,
    });
  }

  /**
   * Deletes a checkout session.
   * @param id - The checkout session ID (must start with "cos-")
   * @param config - Per-request configuration overrides
   * @returns Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id: string, config?: RequestConfig): Promise<ApiDeleteResponse> {
    if (this._http_client.shouldValidate) {
      validateCheckoutSessionId(id);
    }

    return this._http_client.request<ApiDeleteResponse>({
      method: "DELETE",
      path: `/${API_VERSION}/checkout-sessions/${encodeURIComponent(id)}`,
      config,
    });
  }
}
