import * as v from "valibot";

// ============================================================================
// Shared Schemas
// ============================================================================

export const CurrencySchema = v.picklist(["SLE", "USD"]);

export const AmountSchema = v.object({
  currency: CurrencySchema,
  value: v.pipe(v.number(), v.minValue(0)),
});

export const MetadataSchema = v.pipe(
  v.record(v.string(), v.pipe(v.string(), v.maxLength(100))),
  v.check(
    (obj) => Object.keys(obj).length <= 64,
    "metadata cannot have more than 64 keys",
  ),
);

// ============================================================================
// Client Options Schema
// ============================================================================

export const ClientOptionsSchema = v.object({
  spaceId: v.pipe(
    v.string(),
    v.nonEmpty("spaceId is required"),
    v.startsWith("spc-", "spaceId must start with 'spc-'"),
  ),
  accessToken: v.pipe(v.string(), v.nonEmpty("accessToken is required")),
  baseUrl: v.optional(v.string()),
  timeout: v.optional(v.pipe(v.number(), v.minValue(0))),
  retries: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
  retryDelay: v.optional(v.pipe(v.number(), v.minValue(0))),
  retryBackoff: v.optional(v.pipe(v.number(), v.minValue(0))),
  validateInputs: v.optional(v.boolean()),
});

// ============================================================================
// ID Schemas
// ============================================================================

export const PaymentCodeIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("pmc-", "Payment code ID must start with 'pmc-'"),
);

export const PaymentIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("pay-", "Payment ID must start with 'pay-'"),
);

export const CheckoutSessionIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("cos-", "Checkout session ID must start with 'cos-'"),
);

export const PayoutIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("pot-", "Payout ID must start with 'pot-'"),
);

export const WebhookIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("whk-", "Webhook ID must start with 'whk-'"),
);

export const InternalTransferIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("trn-", "Internal transfer ID must start with 'trn-'"),
);

// ============================================================================
// List Params Schema
// ============================================================================

export const LimitSchema = v.optional(
  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
);

// ============================================================================
// Payment Code Schemas
// ============================================================================

export const CreatePaymentCodeInputSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(64)),
  mode: v.optional(v.picklist(["one_time", "recurrent"])),
  enable: v.optional(v.boolean()),
  amount: v.optional(AmountSchema),
  duration: v.optional(v.string()),
  customer: v.optional(v.object({ name: v.optional(v.nullable(v.string())) })),
  reference: v.optional(v.string()),
  authorizedProviders: v.optional(v.array(v.picklist(["m17", "m18", "m13"]))),
  authorizedPhoneNumber: v.optional(v.string()),
  recurrentPaymentTarget: v.optional(
    v.object({
      expectedPaymentCount: v.optional(v.nullable(v.number())),
      expectedPaymentTotal: v.optional(v.nullable(AmountSchema)),
    }),
  ),
  financialAccountId: v.optional(v.string()),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// Checkout Session Schemas
// ============================================================================

export const LineItemSchema = v.object({
  type: v.literal("custom"),
  name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100)),
  price: AmountSchema,
  quantity: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100000)),
});

export const CreateCheckoutSessionInputSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(150)),
  lineItems: v.pipe(v.array(LineItemSchema), v.minLength(1), v.maxLength(16)),
  description: v.optional(v.pipe(v.string(), v.maxLength(1000))),
  cancelUrl: v.optional(v.string()),
  successUrl: v.optional(v.string()),
  callbackState: v.optional(v.pipe(v.string(), v.maxLength(255))),
  reference: v.optional(v.pipe(v.string(), v.maxLength(255))),
  financialAccountId: v.optional(v.string()),
  paymentOptions: v.optional(
    v.object({
      card: v.optional(v.boolean()),
      bank: v.optional(v.boolean()),
      momo: v.optional(v.boolean()),
      wallet: v.optional(v.boolean()),
    }),
  ),
  brandingOptions: v.optional(
    v.object({
      primaryColor: v.optional(v.string()),
    }),
  ),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// Payout Schemas
// ============================================================================

const PayoutDestinationBankSchema = v.object({
  type: v.literal("bank"),
  providerId: v.pipe(v.string(), v.nonEmpty()),
  accountNumber: v.pipe(v.string(), v.nonEmpty()),
});

const PayoutDestinationMomoSchema = v.object({
  type: v.literal("momo"),
  providerId: v.pipe(v.string(), v.nonEmpty()),
  phoneNumber: v.pipe(v.string(), v.nonEmpty()),
});

const PayoutDestinationWalletSchema = v.object({
  type: v.literal("wallet"),
  providerId: v.pipe(v.string(), v.nonEmpty()),
  walletId: v.pipe(v.string(), v.nonEmpty()),
});

export const PayoutDestinationSchema = v.variant("type", [
  PayoutDestinationBankSchema,
  PayoutDestinationMomoSchema,
  PayoutDestinationWalletSchema,
]);

export const CreatePayoutInputSchema = v.object({
  amount: AmountSchema,
  destination: PayoutDestinationSchema,
  source: v.optional(
    v.object({
      financialAccountId: v.optional(v.string()),
    }),
  ),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// Webhook Schemas
// ============================================================================

const WebhookVerificationHS256Schema = v.object({
  type: v.literal("HS256"),
  secret: v.pipe(v.string(), v.minLength(32), v.maxLength(256)),
});

const WebhookVerificationES256Schema = v.object({
  type: v.literal("ES256"),
});

export const WebhookVerificationMethodSchema = v.variant("type", [
  WebhookVerificationHS256Schema,
  WebhookVerificationES256Schema,
]);

export const CreateWebhookInputSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  url: v.pipe(v.string(), v.nonEmpty(), v.maxLength(255)),
  apiRelease: v.picklist(["caph", "siriusb"]),
  events: v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(100)),
  enabled: v.optional(v.boolean()),
  verificationMethod: v.optional(WebhookVerificationMethodSchema),
  headers: v.optional(
    v.pipe(
      v.record(v.string(), v.string()),
      v.check(
        (obj) => Object.keys(obj).length <= 10,
        "headers cannot have more than 10 properties",
      ),
    ),
  ),
  alertEmails: v.optional(v.pipe(v.array(v.string()), v.maxLength(2))),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// Internal Transfer Schemas
// ============================================================================

export const FinancialAccountSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
});

export const CreateInternalTransferInputSchema = v.object({
  amount: AmountSchema,
  sourceFinancialAccount: FinancialAccountSchema,
  destinationFinancialAccount: FinancialAccountSchema,
  description: v.optional(v.pipe(v.string(), v.maxLength(150))),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// USSD OTP Schemas
// ============================================================================

export const UssdOtpIdSchema = v.pipe(
  v.string(),
  v.nonEmpty("id is required"),
  v.startsWith("uop-", "USSD OTP ID must start with 'uop-'"),
);

export const CreateUssdOtpInputSchema = v.object({
  authorizedPhoneNumber: v.pipe(v.string(), v.nonEmpty()),
  verificationMessage: v.optional(v.pipe(v.string(), v.maxLength(255))),
  duration: v.optional(v.string()),
  metadata: v.optional(MetadataSchema),
});

// ============================================================================
// Update Input Schemas
// ============================================================================

const _nullable_metadata_schema = v.optional(v.nullable(MetadataSchema));
const _nullable_amount_schema = v.optional(v.nullable(AmountSchema));

export const UpdatePaymentCodeInputSchema = v.object({
  name: v.optional(
    v.nullable(v.pipe(v.string(), v.minLength(3), v.maxLength(64))),
  ),
  amount: _nullable_amount_schema,
  duration: v.optional(v.nullable(v.string())),
  enable: v.optional(v.nullable(v.boolean())),
  customer: v.optional(
    v.nullable(v.object({ name: v.optional(v.nullable(v.string())) })),
  ),
  reference: v.optional(v.nullable(v.string())),
  authorizedProviders: v.optional(
    v.nullable(v.array(v.picklist(["m17", "m18", "m13"]))),
  ),
  authorizedPhoneNumber: v.optional(v.nullable(v.string())),
  recurrentPaymentTarget: v.optional(
    v.nullable(
      v.object({
        expectedPaymentCount: v.optional(v.nullable(v.number())),
        expectedPaymentTotal: v.optional(v.nullable(AmountSchema)),
      }),
    ),
  ),
  financialAccountId: v.optional(v.nullable(v.string())),
  metadata: _nullable_metadata_schema,
});

export const UpdatePaymentInputSchema = v.object({
  name: v.optional(v.nullable(v.string())),
  metadata: _nullable_metadata_schema,
});

export const UpdatePayoutInputSchema = v.object({
  metadata: _nullable_metadata_schema,
});

export const UpdateWebhookInputSchema = v.object({
  name: v.optional(
    v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
  ),
  url: v.optional(
    v.nullable(v.pipe(v.string(), v.nonEmpty(), v.maxLength(255))),
  ),
  enabled: v.optional(v.nullable(v.boolean())),
  apiRelease: v.optional(v.nullable(v.picklist(["caph", "siriusb"]))),
  events: v.optional(
    v.nullable(v.pipe(v.array(v.string()), v.minLength(1), v.maxLength(100))),
  ),
  headers: v.optional(
    v.nullable(
      v.pipe(
        v.record(v.string(), v.string()),
        v.check(
          (obj) => Object.keys(obj).length <= 10,
          "headers cannot have more than 10 properties",
        ),
      ),
    ),
  ),
  alertEmails: v.optional(
    v.nullable(v.pipe(v.array(v.string()), v.maxLength(2))),
  ),
  metadata: _nullable_metadata_schema,
});

export const UpdateInternalTransferInputSchema = v.object({
  description: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(150)))),
  metadata: _nullable_metadata_schema,
});
