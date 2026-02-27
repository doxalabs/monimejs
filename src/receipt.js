import {
  ReceiptOrderNumberSchema,
  RedeemReceiptInputSchema,
  validate,
} from "./validation.js";

/** @typedef {import("./http-client.js").MonimeHttpClient} MonimeHttpClient */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").Receipt>} ReceiptResponse */
/** @typedef {import("./index.d.ts").ApiResponse<import("./index.d.ts").RedeemReceiptResult>} RedeemReceiptResponse */
/** @typedef {import("./index.d.ts").RedeemReceiptInput} RedeemReceiptInput */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */

class ReceiptModule {
  /** @type {MonimeHttpClient} */
  http_client;

  /** @param {MonimeHttpClient} http_client */
  constructor(http_client) {
    this.http_client = http_client;
  }
  /**
   * Retrieves a receipt by order number.
   * @param {string} orderNumber - The order number of the receipt
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<ReceiptResponse>} The receipt
   * @throws {MonimeValidationError} If orderNumber validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async get(orderNumber, config) {
    if (this.http_client.should_validate) {
      validate(ReceiptOrderNumberSchema, orderNumber);
    }
    return this.http_client.request({
      method: "GET",
      path: `/receipts/${encodeURIComponent(orderNumber)}`,
      config,
    });
  }
  /**
   * Redeems entitlements from a receipt.
   * @param {string} orderNumber - The order number of the receipt
   * @param {RedeemReceiptInput} input - Redemption configuration specifying what to redeem
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<RedeemReceiptResponse>} The redemption result with updated receipt
   * @throws {MonimeValidationError} If validation fails
   * @throws {MonimeApiError} If the API returns an error
   */
  async redeem(orderNumber, input, config) {
    if (this.http_client.should_validate) {
      validate(ReceiptOrderNumberSchema, orderNumber);
      validate(RedeemReceiptInputSchema, input);
    }
    return this.http_client.request({
      method: "POST",
      path: `/receipts/${encodeURIComponent(orderNumber)}/redeem`,
      body: input,
      config,
    });
  }
}
export { ReceiptModule };
