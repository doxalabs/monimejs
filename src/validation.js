import * as v from "valibot";
import { MonimeValidationError } from "./errors.js";
import {
  BankProviderIdSchema,
  ClientOptionsSchema,
  CountryCodeSchema,
  CreateCheckoutSessionInputSchema,
  CreateFinancialAccountInputSchema,
  CreateInternalTransferInputSchema,
  CreatePaymentCodeInputSchema,
  CreatePayoutInputSchema,
  CreateUssdOtpInputSchema,
  CreateWebhookInputSchema,
  IdSchema,
  LimitSchema,
  MomoProviderIdSchema,
  ReceiptOrderNumberSchema,
  RedeemReceiptInputSchema,
  UpdateFinancialAccountInputSchema,
  UpdateInternalTransferInputSchema,
  UpdatePaymentCodeInputSchema,
  UpdatePaymentInputSchema,
  UpdatePayoutInputSchema,
  UpdateWebhookInputSchema,
} from "./schemas.js";

/** @typedef {import("./errors.js").ValidationIssue} ValidationIssue */

/**
 * @param {v.BaseIssue<unknown>[]} issues
 * @returns {MonimeValidationError}
 */
function to_validation_error(issues) {
  if (issues.length === 0) {
    return new MonimeValidationError("Validation failed", [
      { message: "Validation failed", field: "unknown" },
    ]);
  }
  /** @type {ValidationIssue[]} */
  const validation_issues = issues.map((issue) => ({
    message: issue.message,
    field: issue.path?.map((p) => p.key).join(".") ?? "unknown",
    value: issue.input,
  }));
  const first_issue = validation_issues.at(0);
  const message =
    validation_issues.length === 1
      ? first_issue?.message
      : `Validation failed with ${validation_issues.length} errors`;
  return new MonimeValidationError(String(message), validation_issues);
}
/**
 * @template T
 * @param {v.BaseSchema<unknown, T, v.BaseIssue<unknown>>} schema
 * @param {unknown} data
 * @returns {void}
 */
function validate(schema, data) {
  const result = v.safeParse(schema, data);
  if (!result.success) {
    throw to_validation_error(result.issues);
  }
}
export {
  BankProviderIdSchema,
  ClientOptionsSchema,
  CountryCodeSchema,
  CreateCheckoutSessionInputSchema,
  CreateFinancialAccountInputSchema,
  CreateInternalTransferInputSchema,
  CreatePaymentCodeInputSchema,
  CreatePayoutInputSchema,
  CreateUssdOtpInputSchema,
  CreateWebhookInputSchema,
  IdSchema,
  LimitSchema,
  MomoProviderIdSchema,
  ReceiptOrderNumberSchema,
  RedeemReceiptInputSchema,
  UpdateFinancialAccountInputSchema,
  UpdateInternalTransferInputSchema,
  UpdatePaymentCodeInputSchema,
  UpdatePaymentInputSchema,
  UpdatePayoutInputSchema,
  UpdateWebhookInputSchema,
  validate,
};
