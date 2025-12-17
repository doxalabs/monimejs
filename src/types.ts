// Client configuration
export type ClientOptions = {
  spaceId: string;
  accessToken: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  retryBackoff?: number;
  validateInputs?: boolean;
};

// Per-request configuration
export type RequestConfig = {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
};

// Shared types
export type Currency = "SLE" | "USD";

export type Amount = {
  currency: Currency;
  value: number;
};

export type Metadata = Record<string, string>;

export type OwnershipGraph = {
  owner: {
    id: string;
    type: string;
    metadata?: Metadata;
  };
};

export type PaginationInfo = {
  count: number;
  next: string | null;
};

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  messages: string[];
  result: T;
};

export type ApiListResponse<T> = {
  success: boolean;
  messages: string[];
  result: T[];
  pagination: PaginationInfo;
};

export type ApiDeleteResponse = {
  success: boolean;
  messages: string[];
};

// Payment Code types
export type PaymentCodeMode = "one_time" | "recurrent";

export type PaymentCodeStatus =
  | "pending"
  | "cancelled"
  | "processing"
  | "expired"
  | "completed";

export type PaymentCodeProvider = "m17" | "m18" | "m13";

export type PaymentCodeCustomer = {
  name?: string | null;
};

export type RecurrentPaymentTarget = {
  expectedPaymentCount?: number | null;
  expectedPaymentTotal?: Amount | null;
};

export type ProcessedPaymentData = {
  amount: Amount;
  orderId: string;
  paymentId: string;
  orderNumber: string;
  channelData: {
    providerId: string;
    accountId: string;
    reference: string;
  };
  financialTransactionReference: string;
  metadata?: Metadata;
};

// PaymentCode response object (from API)
export type PaymentCode = {
  id: string;
  mode: PaymentCodeMode;
  status: PaymentCodeStatus;
  name?: string | null;
  amount: Amount;
  enable: boolean;
  expireTime: string;
  customer?: PaymentCodeCustomer | null;
  ussdCode: string;
  reference?: string | null;
  authorizedProviders?: PaymentCodeProvider[] | null;
  authorizedPhoneNumber: string;
  recurrentPaymentTarget?: RecurrentPaymentTarget | null;
  financialAccountId?: string | null;
  processedPaymentData?: ProcessedPaymentData | null;
  createTime: string;
  updateTime?: string | null;
  ownershipGraph?: OwnershipGraph | null;
  metadata?: Metadata | null;
};

// PaymentCode input types
export type CreatePaymentCodeInput = {
  name: string;
  mode?: PaymentCodeMode;
  enable?: boolean;
  amount?: Amount;
  duration?: string;
  customer?: PaymentCodeCustomer;
  reference?: string;
  authorizedProviders?: PaymentCodeProvider[];
  authorizedPhoneNumber?: string;
  recurrentPaymentTarget?: RecurrentPaymentTarget;
  financialAccountId?: string;
  metadata?: Metadata;
};

export type UpdatePaymentCodeInput = {
  name?: string | null;
  amount?: Amount | null;
  duration?: string | null;
  enable?: boolean | null;
  customer?: PaymentCodeCustomer | null;
  reference?: string | null;
  authorizedProviders?: PaymentCodeProvider[] | null;
  authorizedPhoneNumber?: string | null;
  recurrentPaymentTarget?: RecurrentPaymentTarget | null;
  financialAccountId?: string | null;
  metadata?: Metadata | null;
};

export type ListPaymentCodesParams = {
  ussd_code?: string;
  mode?: PaymentCodeMode;
  status?: PaymentCodeStatus;
  limit?: number;
  after?: string;
};

// Payment types
export type PaymentStatus = "pending" | "processing" | "completed";

export type ChannelType = "bank" | "card" | "momo" | "wallet";

export type Channel = {
  type: ChannelType;
};

export type Fee = {
  code: string;
  amount: Amount;
  metadata?: Metadata;
};

// Payment response object (from API)
export type Payment = {
  id: string;
  status: PaymentStatus;
  amount: Amount;
  channel?: Channel | null;
  name?: string | null;
  reference?: string | null;
  orderNumber?: string | null;
  financialAccountId?: string | null;
  financialTransactionReference?: string | null;
  fees?: Fee[] | null;
  createTime: string;
  updateTime?: string | null;
  ownershipGraph?: OwnershipGraph | null;
  metadata?: Metadata | null;
};

// Payment input types
export type ListPaymentsParams = {
  orderNumber?: string;
  financialAccountId?: string;
  financialTransactionReference?: string;
  limit?: number;
  after?: string;
};

export type UpdatePaymentInput = {
  name?: string | null;
  metadata?: Metadata | null;
};

// Checkout Session types
export type CheckoutSessionStatus =
  | "pending"
  | "completed"
  | "cancelled"
  | "expired";

export type LineItemType = "custom";

export type LineItem = {
  type: LineItemType;
  name: string;
  price: Amount;
  quantity: number;
};

export type LineItems = {
  data: LineItem[];
};

export type BrandingOptions = {
  primaryColor?: string;
};

export type PaymentOptions = {
  card?: boolean;
  bank?: boolean;
  momo?: boolean;
  wallet?: boolean;
};

// CheckoutSession response object (from API)
export type CheckoutSession = {
  id: string;
  status: CheckoutSessionStatus;
  name: string;
  orderNumber: string;
  reference?: string | null;
  description?: string | null;
  redirectUrl: string;
  cancelUrl?: string | null;
  successUrl?: string | null;
  lineItems: LineItems;
  financialAccountId?: string | null;
  brandingOptions?: BrandingOptions | null;
  expireTime: string;
  createTime: string;
  ownershipGraph?: OwnershipGraph | null;
  metadata?: Metadata | null;
};

// CheckoutSession input types
export type CreateCheckoutSessionInput = {
  name: string;
  lineItems: LineItem[];
  description?: string;
  cancelUrl?: string;
  successUrl?: string;
  callbackState?: string;
  reference?: string;
  financialAccountId?: string;
  paymentOptions?: PaymentOptions;
  brandingOptions?: BrandingOptions;
  metadata?: Metadata;
};

export type ListCheckoutSessionsParams = {
  limit?: number;
  after?: string;
};

// Payout types
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export type PayoutDestinationType = "bank" | "momo" | "wallet";

export type PayoutFailureCode =
  | "unknown"
  | "fund_insufficient"
  | "authorization_failed"
  | "provider_unknown"
  | "provider_account_blocked"
  | "provider_account_missing"
  | "provider_account_quota_exhausted";

export type PayoutSource = {
  financialAccountId: string;
  transactionReference?: string | null;
};

export type PayoutDestinationBank = {
  type: "bank";
  providerId: string;
  accountNumber: string;
};

export type PayoutDestinationMomo = {
  type: "momo";
  providerId: string;
  phoneNumber: string;
};

export type PayoutDestinationWallet = {
  type: "wallet";
  providerId: string;
  walletId: string;
};

export type PayoutDestination =
  | PayoutDestinationBank
  | PayoutDestinationMomo
  | PayoutDestinationWallet;

export type PayoutFailureDetail = {
  code: PayoutFailureCode;
  message: string;
};

// Payout response object (from API)
export type Payout = {
  id: string;
  status: PayoutStatus;
  amount: Amount;
  source: PayoutSource;
  destination: PayoutDestination;
  fees?: Fee[] | null;
  failureDetail?: PayoutFailureDetail | null;
  createTime: string;
  updateTime?: string | null;
  ownershipGraph?: OwnershipGraph | null;
  metadata?: Metadata | null;
};

// Payout input types
export type CreatePayoutSourceInput = {
  financialAccountId?: string;
};

export type CreatePayoutDestinationBankInput = {
  type: "bank";
  providerId: string;
  accountNumber: string;
};

export type CreatePayoutDestinationMomoInput = {
  type: "momo";
  providerId: string;
  phoneNumber: string;
};

export type CreatePayoutDestinationWalletInput = {
  type: "wallet";
  providerId: string;
  walletId: string;
};

export type CreatePayoutDestinationInput =
  | CreatePayoutDestinationBankInput
  | CreatePayoutDestinationMomoInput
  | CreatePayoutDestinationWalletInput;

export type CreatePayoutInput = {
  amount: Amount;
  destination: CreatePayoutDestinationInput;
  source?: CreatePayoutSourceInput;
  metadata?: Metadata;
};

export type UpdatePayoutInput = {
  metadata?: Metadata | null;
};

export type ListPayoutsParams = {
  status?: PayoutStatus;
  sourceFinancialAccountId?: string;
  sourceTransactionReference?: string;
  destinationTransactionReference?: string;
  limit?: number;
  after?: string;
};

// Webhook types
export type WebhookApiRelease = "caph" | "siriusb";

export type WebhookVerificationType = "HS256" | "ES256";

export type WebhookVerificationMethodHS256 = {
  type: "HS256";
  secret: string;
};

export type WebhookVerificationMethodES256 = {
  type: "ES256";
  publicKey?: string;
};

export type WebhookVerificationMethod =
  | WebhookVerificationMethodHS256
  | WebhookVerificationMethodES256;

export type WebhookHeaders = Record<string, string>;

// Webhook response object (from API)
export type Webhook = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  events: string[];
  apiRelease: WebhookApiRelease;
  verificationMethod: WebhookVerificationMethod;
  headers?: WebhookHeaders | null;
  alertEmails?: string[] | null;
  createTime: string;
  updateTime?: string | null;
  metadata?: Metadata | null;
};

// Webhook input types
export type CreateWebhookVerificationMethodInput =
  | { type: "HS256"; secret: string }
  | { type: "ES256" };

export type CreateWebhookInput = {
  name: string;
  url: string;
  apiRelease: WebhookApiRelease;
  events: string[];
  enabled?: boolean;
  verificationMethod?: CreateWebhookVerificationMethodInput;
  headers?: WebhookHeaders;
  alertEmails?: string[];
  metadata?: Metadata;
};

export type UpdateWebhookInput = {
  name?: string | null;
  url?: string | null;
  enabled?: boolean | null;
  apiRelease?: WebhookApiRelease | null;
  events?: string[] | null;
  headers?: WebhookHeaders | null;
  alertEmails?: string[] | null;
  metadata?: Metadata | null;
};

export type ListWebhooksParams = {
  limit?: number;
  after?: string;
};

// Internal Transfer types
export type InternalTransferStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type InternalTransferFailureCode = "unknown" | "fund_insufficient";

export type InternalTransferFailureDetail = {
  code: InternalTransferFailureCode;
  message?: string | null;
};

export type FinancialAccount = {
  id: string;
};

// InternalTransfer response object (from API)
export type InternalTransfer = {
  id: string;
  status: InternalTransferStatus;
  amount: Amount;
  sourceFinancialAccount: FinancialAccount;
  destinationFinancialAccount: FinancialAccount;
  financialTransactionReference?: string | null;
  description?: string | null;
  failureDetail?: InternalTransferFailureDetail | null;
  ownershipGraph?: OwnershipGraph | null;
  createTime: string;
  updateTime?: string | null;
  metadata?: Metadata | null;
};

// InternalTransfer input types
export type CreateInternalTransferInput = {
  amount: Amount;
  sourceFinancialAccount: FinancialAccount;
  destinationFinancialAccount: FinancialAccount;
  description?: string;
  metadata?: Metadata;
};

export type UpdateInternalTransferInput = {
  description?: string | null;
  metadata?: Metadata | null;
};

export type ListInternalTransfersParams = {
  status?: InternalTransferStatus;
  sourceFinancialAccountId?: string;
  destinationFinancialAccountId?: string;
  financialTransactionReference?: string;
  limit?: number;
  after?: string;
};

// USSD OTP types
export type UssdOtpStatus = "pending" | "verified" | "expired";

// UssdOtp response object (from API)
export type UssdOtp = {
  id: string;
  status: UssdOtpStatus;
  dialCode: string;
  authorizedPhoneNumber: string;
  verificationMessage?: string | null;
  createTime: string;
  expireTime: string;
  metadata?: Metadata | null;
};

// UssdOtp input types
export type CreateUssdOtpInput = {
  authorizedPhoneNumber: string;
  verificationMessage?: string;
  duration?: string;
  metadata?: Metadata;
};

export type ListUssdOtpsParams = {
  limit?: number;
  after?: string;
};
