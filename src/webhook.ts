import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiDeleteResponse,
  ApiListResponse,
  ApiResponse,
  CreateWebhookInput,
  ListWebhooksParams,
  RequestConfig,
  UpdateWebhookInput,
  Webhook,
} from "./types";
import {
  validateCreateWebhookInput,
  validateLimit,
  validateUpdateWebhookInput,
  validateWebhookId,
} from "./validation";

/**
 * Module for managing webhooks.
 * Webhooks allow you to receive real-time notifications about events in your account.
 */
export class WebhookModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Creates a new webhook.
   * @param input - Webhook configuration including URL and events
   * @param idempotencyKey - Optional key to prevent duplicate requests
   * @param config - Per-request configuration overrides
   * @returns The created webhook
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(
    input: CreateWebhookInput,
    idempotencyKey?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<Webhook>> {
    if (this._http_client.shouldValidate) {
      validateCreateWebhookInput(input);
    }

    return this._http_client.request<ApiResponse<Webhook>>({
      method: "POST",
      path: `/${API_VERSION}/webhooks`,
      body: input,
      idempotencyKey,
      config,
    });
  }

  /**
   * Retrieves a webhook by ID.
   * @param id - The webhook ID (must start with "whk-")
   * @param config - Per-request configuration overrides
   * @returns The webhook
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id: string, config?: RequestConfig): Promise<ApiResponse<Webhook>> {
    if (this._http_client.shouldValidate) {
      validateWebhookId(id);
    }

    return this._http_client.request<ApiResponse<Webhook>>({
      method: "GET",
      path: `/${API_VERSION}/webhooks/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists webhooks with optional pagination.
   * @param params - Optional pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of webhooks
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListWebhooksParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<Webhook>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<Webhook>>({
      method: "GET",
      path: `/${API_VERSION}/webhooks`,
      params: query_params,
      config,
    });
  }

  /**
   * Updates a webhook.
   * @param id - The webhook ID (must start with "whk-")
   * @param input - Fields to update (null values will clear the field)
   * @param config - Per-request configuration overrides
   * @returns The updated webhook
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async update(
    id: string,
    input: UpdateWebhookInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<Webhook>> {
    if (this._http_client.shouldValidate) {
      validateWebhookId(id);
      validateUpdateWebhookInput(input);
    }

    return this._http_client.request<ApiResponse<Webhook>>({
      method: "PATCH",
      path: `/${API_VERSION}/webhooks/${encodeURIComponent(id)}`,
      body: input,
      config,
    });
  }

  /**
   * Deletes a webhook.
   * @param id - The webhook ID (must start with "whk-")
   * @param config - Per-request configuration overrides
   * @returns Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id: string, config?: RequestConfig): Promise<ApiDeleteResponse> {
    if (this._http_client.shouldValidate) {
      validateWebhookId(id);
    }

    return this._http_client.request<ApiDeleteResponse>({
      method: "DELETE",
      path: `/${API_VERSION}/webhooks/${encodeURIComponent(id)}`,
      config,
    });
  }
}
