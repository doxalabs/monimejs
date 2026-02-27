import {
  CountryCodeSchema,
  LimitSchema,
  MomoProviderIdSchema,
  validate,
} from "./validation.js";

/** @typedef {import("./http-client.js").MonimeHttpClient} MonimeHttpClient */
/** @typedef {import("./index.d.ts").ApiListResponse<import("./index.d.ts").Momo>} MomoListResponse */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").Momo>} MomoResponse */
/** @typedef {import("./index.d.ts").ListMomosParams} ListMomosParams */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */

class MomoModule {
  /** @type {MonimeHttpClient} */
  http_client;

  /** @param {MonimeHttpClient} http_client */
  constructor(http_client) {
    this.http_client = http_client;
  }
  /**
   * Lists mobile money providers available in a specified country.
   * @param {ListMomosParams} params - Filter and pagination parameters
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<MomoListResponse>} A paginated list of mobile money providers
   * @throws {MonimeValidationError} If params validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async list(params, config) {
    if (this.http_client.should_validate) {
      validate(CountryCodeSchema, params.country);
      if (params.limit !== void 0) {
        validate(LimitSchema, params.limit);
      }
    }
    const query_params = {
      country: params.country,
      limit: params.limit,
      after: params.after,
    };
    return this.http_client.request({
      method: "GET",
      path: "/momos",
      params: query_params,
      config,
    });
  }
  /**
   * Retrieves a mobile money provider by its provider ID.
   * @param {string} providerId - The mobile money provider ID
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<MomoResponse>} The mobile money provider
   * @throws {MonimeValidationError} If providerId validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(providerId, config) {
    if (this.http_client.should_validate) {
      validate(MomoProviderIdSchema, providerId);
    }
    return this.http_client.request({
      method: "GET",
      path: `/momos/${encodeURIComponent(providerId)}`,
      config,
    });
  }
}
export { MomoModule };
