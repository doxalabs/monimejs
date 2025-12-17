import * as v from "valibot";
import { MonimeValidationError } from "./errors";
import {
  CheckoutSessionIdSchema,
  ClientOptionsSchema,
  CreateCheckoutSessionInputSchema,
  CreateInternalTransferInputSchema,
  CreatePaymentCodeInputSchema,
  CreatePayoutInputSchema,
  CreateUssdOtpInputSchema,
  CreateWebhookInputSchema,
  InternalTransferIdSchema,
  LimitSchema,
  PaymentCodeIdSchema,
  PaymentIdSchema,
  PayoutIdSchema,
  UpdateInternalTransferInputSchema,
  UpdatePaymentCodeInputSchema,
  UpdatePaymentInputSchema,
  UpdatePayoutInputSchema,
  UpdateWebhookInputSchema,
  UssdOtpIdSchema,
  WebhookIdSchema,
} from "./schemas";
import type { ClientOptions } from "./types";

/**
 * Converts valibot issues to MonimeValidationError
 */
function _to_validation_error(
  issues: v.BaseIssue<unknown>[],
): MonimeValidationError {
  const issue = issues[0];
  if (!issue) {
    return new MonimeValidationError("Validation failed", "unknown", undefined);
  }

  const path = issue.path?.map((p) => p.key).join(".") ?? "unknown";
  return new MonimeValidationError(issue.message, path, issue.input);
}

/**
 * Generic validation function using valibot schema
 */
function _validate<T>(
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
  data: unknown,
): void {
  const result = v.safeParse(schema, data);
  if (!result.success) {
    throw _to_validation_error(result.issues);
  }
}

// ============================================================================
// Client Options Validation
// ============================================================================

export function validateClientOptions(options: ClientOptions): void {
  _validate(ClientOptionsSchema, options);
}

// ============================================================================
// ID Validations
// ============================================================================

export function validatePaymentCodeId(id: string): void {
  _validate(PaymentCodeIdSchema, id);
}

export function validatePaymentId(id: string): void {
  _validate(PaymentIdSchema, id);
}

export function validateCheckoutSessionId(id: string): void {
  _validate(CheckoutSessionIdSchema, id);
}

export function validatePayoutId(id: string): void {
  _validate(PayoutIdSchema, id);
}

export function validateWebhookId(id: string): void {
  _validate(WebhookIdSchema, id);
}

export function validateInternalTransferId(id: string): void {
  _validate(InternalTransferIdSchema, id);
}

export function validateUssdOtpId(id: string): void {
  _validate(UssdOtpIdSchema, id);
}

// ============================================================================
// List Params Validation
// ============================================================================

export function validateLimit(limit: number | undefined): void {
  if (limit === undefined) return;
  _validate(LimitSchema, limit);
}

// ============================================================================
// Create Input Validations
// ============================================================================

export function validateCreatePaymentCodeInput(input: unknown): void {
  _validate(CreatePaymentCodeInputSchema, input);
}

export function validateCreateCheckoutSessionInput(input: unknown): void {
  _validate(CreateCheckoutSessionInputSchema, input);
}

export function validateCreatePayoutInput(input: unknown): void {
  _validate(CreatePayoutInputSchema, input);
}

export function validateCreateWebhookInput(input: unknown): void {
  _validate(CreateWebhookInputSchema, input);
}

export function validateCreateInternalTransferInput(input: unknown): void {
  _validate(CreateInternalTransferInputSchema, input);
}

export function validateCreateUssdOtpInput(input: unknown): void {
  _validate(CreateUssdOtpInputSchema, input);
}

// ============================================================================
// Update Input Validations
// ============================================================================

export function validateUpdatePaymentCodeInput(input: unknown): void {
  _validate(UpdatePaymentCodeInputSchema, input);
}

export function validateUpdatePaymentInput(input: unknown): void {
  _validate(UpdatePaymentInputSchema, input);
}

export function validateUpdatePayoutInput(input: unknown): void {
  _validate(UpdatePayoutInputSchema, input);
}

export function validateUpdateWebhookInput(input: unknown): void {
  _validate(UpdateWebhookInputSchema, input);
}

export function validateUpdateInternalTransferInput(input: unknown): void {
  _validate(UpdateInternalTransferInputSchema, input);
}
