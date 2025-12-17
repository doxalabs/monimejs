import { API_VERSION, type MonimeHttpClient } from "./http-client";
import type {
  ApiDeleteResponse,
  ApiListResponse,
  ApiResponse,
  CreateUssdOtpInput,
  ListUssdOtpsParams,
  RequestConfig,
  UssdOtp,
} from "./types";
import {
  validateCreateUssdOtpInput,
  validateLimit,
  validateUssdOtpId,
} from "./validation";

/**
 * Module for managing USSD OTP verification.
 * USSD OTP allows you to verify phone numbers via USSD dial codes.
 */
export class UssdOtpModule {
  private _http_client: MonimeHttpClient;

  constructor(httpClient: MonimeHttpClient) {
    this._http_client = httpClient;
  }

  /**
   * Creates a new USSD OTP verification request.
   * @param input - OTP configuration including phone number
   * @param idempotencyKey - Optional key to prevent duplicate requests
   * @param config - Per-request configuration overrides
   * @returns The created USSD OTP with dial code
   * @throws {MonimeValidationError} If input validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async create(
    input: CreateUssdOtpInput,
    idempotencyKey?: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<UssdOtp>> {
    if (this._http_client.shouldValidate) {
      validateCreateUssdOtpInput(input);
    }

    return this._http_client.request<ApiResponse<UssdOtp>>({
      method: "POST",
      path: `/${API_VERSION}/ussd-otps`,
      body: input,
      idempotencyKey,
      config,
    });
  }

  /**
   * Retrieves a USSD OTP by ID.
   * @param id - The USSD OTP ID (must start with "uop-")
   * @param config - Per-request configuration overrides
   * @returns The USSD OTP
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(id: string, config?: RequestConfig): Promise<ApiResponse<UssdOtp>> {
    if (this._http_client.shouldValidate) {
      validateUssdOtpId(id);
    }

    return this._http_client.request<ApiResponse<UssdOtp>>({
      method: "GET",
      path: `/${API_VERSION}/ussd-otps/${encodeURIComponent(id)}`,
      config,
    });
  }

  /**
   * Lists USSD OTPs with optional pagination.
   * @param params - Optional pagination parameters
   * @param config - Per-request configuration overrides
   * @returns A paginated list of USSD OTPs
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(
    params?: ListUssdOtpsParams,
    config?: RequestConfig,
  ): Promise<ApiListResponse<UssdOtp>> {
    if (this._http_client.shouldValidate && params?.limit !== undefined) {
      validateLimit(params.limit);
    }

    const query_params = params
      ? {
          limit: params.limit,
          after: params.after,
        }
      : undefined;

    return this._http_client.request<ApiListResponse<UssdOtp>>({
      method: "GET",
      path: `/${API_VERSION}/ussd-otps`,
      params: query_params,
      config,
    });
  }

  /**
   * Deletes a USSD OTP.
   * @param id - The USSD OTP ID (must start with "uop-")
   * @param config - Per-request configuration overrides
   * @returns Confirmation of deletion
   * @throws {MonimeValidationError} If ID validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async delete(id: string, config?: RequestConfig): Promise<ApiDeleteResponse> {
    if (this._http_client.shouldValidate) {
      validateUssdOtpId(id);
    }

    return this._http_client.request<ApiDeleteResponse>({
      method: "DELETE",
      path: `/${API_VERSION}/ussd-otps/${encodeURIComponent(id)}`,
      config,
    });
  }
}
