# Monime SDK Examples

## Setup

```typescript
import { MonimeClient } from "monimejs";

const client = new MonimeClient({
  spaceId: "spc-your-space-id",
  accessToken: "your-access-token",
});
```

---

## Checkout Sessions

### Create a Checkout Session

```typescript
const session = await client.checkoutSession.create({
  name: "Order #12345",
  lineItems: [
    {
      type: "custom",
      name: "Premium T-Shirt",
      price: { currency: "SLE", value: 15000 }, // 150.00 SLE
      quantity: 2,
    },
    {
      type: "custom",
      name: "Shipping",
      price: { currency: "SLE", value: 2500 }, // 25.00 SLE
      quantity: 1,
    },
  ],
  successUrl: "https://yoursite.com/checkout/success",
  cancelUrl: "https://yoursite.com/checkout/cancel",
  description: "Order from Your Store",
  reference: "order-12345",
  metadata: {
    customerId: "cust-123",
    source: "web",
  },
});

// Redirect customer to the checkout page
console.log(session.result.redirectUrl);
```

### Create a Checkout Session with Branding

```typescript
const session = await client.checkoutSession.create({
  name: "Premium Subscription",
  lineItems: [
    {
      type: "custom",
      name: "Annual Plan",
      price: { currency: "SLE", value: 100000 },
      quantity: 1,
    },
  ],
  successUrl: "https://yoursite.com/success",
  cancelUrl: "https://yoursite.com/cancel",
  brandingOptions: {
    primaryColor: "#4F46E5",
  },
  paymentOptions: {
    momo: true,
    card: true,
    bank: false,
    wallet: false,
  },
});
```

### Get a Checkout Session

```typescript
const session = await client.checkoutSession.get("cos-session-id");

console.log(session.result.status); // "pending", "completed", "cancelled", "expired"
console.log(session.result.orderNumber);
```

### List Checkout Sessions

```typescript
// List with default pagination
const sessions = await client.checkoutSession.list();

// List with custom limit
const sessions = await client.checkoutSession.list({ limit: 25 });

// Paginate through results
let after: string | null = null;
do {
  const response = await client.checkoutSession.list({
    limit: 50,
    ...(after && { after }),
  });

  for (const session of response.result) {
    console.log(session.id, session.status);
  }

  after = response.pagination.next;
} while (after);
```

### Delete a Checkout Session

```typescript
// Only works for sessions that haven't been initiated
await client.checkoutSession.delete("cos-session-id");
```

---

## Payouts

### Create a Mobile Money Payout

```typescript
const payout = await client.payout.create({
  amount: {
    currency: "SLE",
    value: 50000, // 500.00 SLE
  },
  destination: {
    type: "momo",
    providerId: "m17", // Orange Money
    phoneNumber: "+23276123456",
  },
  metadata: {
    reason: "Salary payment",
    employeeId: "emp-456",
  },
});

console.log(payout.result.id);
console.log(payout.result.status); // "pending"
```

### Create a Bank Payout

```typescript
const payout = await client.payout.create({
  amount: {
    currency: "SLE",
    value: 1000000, // 10,000.00 SLE
  },
  destination: {
    type: "bank",
    providerId: "bank-provider-id",
    accountNumber: "1234567890",
  },
  source: {
    financialAccountId: "fa-specific-account", // Optional, defaults to main account
  },
});
```

### Create a Wallet Payout

```typescript
const payout = await client.payout.create({
  amount: {
    currency: "SLE",
    value: 25000,
  },
  destination: {
    type: "wallet",
    providerId: "wallet-provider-id",
    walletId: "wallet-123",
  },
});
```

### Get a Payout

```typescript
const payout = await client.payout.get("pot-payout-id");

console.log(payout.result.status); // "pending", "processing", "completed", "failed"

// Check for failure details
if (payout.result.status === "failed" && payout.result.failureDetail) {
  console.log(payout.result.failureDetail.code);
  console.log(payout.result.failureDetail.message);
}

// Check fees after completion
if (payout.result.fees) {
  for (const fee of payout.result.fees) {
    console.log(`${fee.code}: ${fee.amount.value} ${fee.amount.currency}`);
  }
}
```

### List Payouts

```typescript
// List all payouts
const payouts = await client.payout.list();

// Filter by status
const completedPayouts = await client.payout.list({
  status: "completed",
});

// Filter by source account
const accountPayouts = await client.payout.list({
  sourceFinancialAccountId: "fa-account-id",
});

// Combined filters with pagination
const payouts = await client.payout.list({
  status: "failed",
  limit: 20,
});
```

### Update a Payout

```typescript
// Only works for payouts that haven't been processed yet
const payout = await client.payout.update("pot-payout-id", {
  metadata: {
    updatedBy: "admin",
    note: "Updated recipient info",
  },
});
```

### Delete a Payout

```typescript
// Only works for pending payouts
await client.payout.delete("pot-payout-id");
```

---

## Error Handling

```typescript
import {
  MonimeApiError,
  MonimeValidationError,
  MonimeTimeoutError,
  MonimeNetworkError,
} from "monimejs";

try {
  const payout = await client.payout.create({
    amount: { currency: "SLE", value: 1000 },
    destination: {
      type: "momo",
      providerId: "m17",
      phoneNumber: "+23276123456",
    },
  });
} catch (error) {
  if (error instanceof MonimeValidationError) {
    // Client-side validation failed
    console.log(`Validation error on ${error.field}: ${error.message}`);
  } else if (error instanceof MonimeApiError) {
    // API returned an error
    console.log(`API error ${error.statusCode}: ${error.message}`);
    console.log(`Reason: ${error.reason}`);

    if (error.isRetryable) {
      // Can retry this request
    }
  } else if (error instanceof MonimeTimeoutError) {
    console.log(`Request timed out after ${error.timeout}ms`);
  } else if (error instanceof MonimeNetworkError) {
    console.log(`Network error: ${error.message}`);
  }
}
```

---

## Request Configuration

### Custom Timeout

```typescript
const payout = await client.payout.create(
  {
    amount: { currency: "SLE", value: 1000 },
    destination: {
      type: "momo",
      providerId: "m17",
      phoneNumber: "+23276123456",
    },
  },
  undefined, // idempotencyKey
  { timeout: 60000 } // 60 second timeout
);
```

### Idempotency Key

```typescript
// Use idempotency key to prevent duplicate payouts
const idempotencyKey = `payout-${orderId}-${Date.now()}`;

const payout = await client.payout.create(
  {
    amount: { currency: "SLE", value: 1000 },
    destination: {
      type: "momo",
      providerId: "m17",
      phoneNumber: "+23276123456",
    },
  },
  idempotencyKey
);
```

### Abort Signal

```typescript
const controller = new AbortController();

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const sessions = await client.checkoutSession.list(
    { limit: 50 },
    { signal: controller.signal }
  );
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was cancelled");
  }
}
```

---

## Webhooks

### Create a Webhook with HMAC Verification

```typescript
const webhook = await client.webhook.create({
  name: "My Ecommerce Webhook",
  url: "https://yoursite.com/webhooks/monime",
  apiRelease: "caph",
  events: ["payment.completed", "payment.failed", "payout.completed"],
  verificationMethod: {
    type: "HS256",
    secret: "your-32-character-minimum-secret-key-here",
  },
  alertEmails: ["alerts@yoursite.com"],
  metadata: {
    environment: "production",
  },
});

console.log(webhook.result.id);
console.log(webhook.result.enabled); // true by default
```

### Create a Webhook with ECDSA Verification

```typescript
const webhook = await client.webhook.create({
  name: "Secure Webhook",
  url: "https://yoursite.com/webhooks/monime",
  apiRelease: "caph",
  events: ["payment.completed"],
  verificationMethod: {
    type: "ES256",
  },
});

// The public key will be available in the response
console.log(webhook.result.verificationMethod);
```

### Create a Webhook with Custom Headers

```typescript
const webhook = await client.webhook.create({
  name: "Authenticated Webhook",
  url: "https://yoursite.com/webhooks/monime",
  apiRelease: "caph",
  events: ["payment.completed", "payout.failed"],
  headers: {
    "X-Custom-Auth": "your-auth-token",
    "X-Environment": "production",
  },
});
```

### Get a Webhook

```typescript
const webhook = await client.webhook.get("whk-webhook-id");

console.log(webhook.result.name);
console.log(webhook.result.url);
console.log(webhook.result.enabled);
console.log(webhook.result.events);
```

### List Webhooks

```typescript
// List all webhooks
const webhooks = await client.webhook.list();

// List with pagination
const webhooks = await client.webhook.list({ limit: 25 });

// Paginate through all webhooks
let after: string | null = null;
do {
  const response = await client.webhook.list({
    limit: 50,
    ...(after && { after }),
  });

  for (const webhook of response.result) {
    console.log(webhook.id, webhook.name, webhook.enabled);
  }

  after = response.pagination.next;
} while (after);
```

### Update a Webhook

```typescript
// Disable a webhook
const webhook = await client.webhook.update("whk-webhook-id", {
  enabled: false,
});

// Update webhook URL and events
const webhook = await client.webhook.update("whk-webhook-id", {
  url: "https://yoursite.com/webhooks/monime-v2",
  events: ["payment.completed", "payment.failed", "payout.completed", "payout.failed"],
});

// Update alert emails
const webhook = await client.webhook.update("whk-webhook-id", {
  alertEmails: ["new-alerts@yoursite.com", "backup@yoursite.com"],
});
```

### Delete a Webhook

```typescript
// Permanently delete a webhook (irreversible)
await client.webhook.delete("whk-webhook-id");
```

### Common Webhook Events

```typescript
// Payment events
const paymentEvents = [
  "payment.created",
  "payment.completed",
  "payment.failed",
];

// Payout events
const payoutEvents = [
  "payout.created",
  "payout.processing",
  "payout.completed",
  "payout.failed",
];

// Checkout session events
const checkoutEvents = [
  "checkout_session.completed",
  "checkout_session.expired",
];

// Create a webhook for all critical events
const webhook = await client.webhook.create({
  name: "All Critical Events",
  url: "https://yoursite.com/webhooks/monime",
  apiRelease: "caph",
  events: [...paymentEvents, ...payoutEvents, ...checkoutEvents],
  verificationMethod: {
    type: "HS256",
    secret: "your-secure-secret-minimum-32-chars",
  },
});
```

### Verifying Webhook Signatures (Server-Side)

```typescript
import crypto from "crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js example
app.post("/webhooks/monime", (req, res) => {
  const signature = req.headers["x-monime-signature"];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send("Invalid signature");
  }

  // Process the webhook event
  const event = req.body;
  console.log(`Received event: ${event.type}`);

  res.status(200).send("OK");
});
```

---

## Internal Transfers

Internal transfers move funds between financial accounts within the same Space, operating entirely within Monime's ledger system.

### Create an Internal Transfer

```typescript
const transfer = await client.internalTransfer.create({
  amount: {
    currency: "SLE",
    value: 100000, // 1,000.00 SLE
  },
  sourceFinancialAccount: {
    id: "fa-source-account-id",
  },
  destinationFinancialAccount: {
    id: "fa-destination-account-id",
  },
  description: "Transfer to user wallet",
  metadata: {
    userId: "user-123",
    reason: "wallet_topup",
  },
});

console.log(transfer.result.id);
console.log(transfer.result.status); // "pending", "processing", "completed", "failed"
```

### Transfer Between Operational and User Accounts

```typescript
// Top up a user's wallet from operational float
const walletTopup = await client.internalTransfer.create({
  amount: { currency: "SLE", value: 50000 },
  sourceFinancialAccount: { id: "fa-operational-float" },
  destinationFinancialAccount: { id: "fa-user-wallet-123" },
  description: "User wallet top-up",
});

// Withdraw from user wallet to operational account
const withdrawal = await client.internalTransfer.create({
  amount: { currency: "SLE", value: 25000 },
  sourceFinancialAccount: { id: "fa-user-wallet-123" },
  destinationFinancialAccount: { id: "fa-operational-float" },
  description: "User withdrawal request",
});
```

### Get an Internal Transfer

```typescript
const transfer = await client.internalTransfer.get("trn-transfer-id");

console.log(transfer.result.status);
console.log(transfer.result.amount);
console.log(transfer.result.sourceFinancialAccount.id);
console.log(transfer.result.destinationFinancialAccount.id);

// Check for failure details
if (transfer.result.status === "failed" && transfer.result.failureDetail) {
  console.log(transfer.result.failureDetail.code); // "unknown" or "fund_insufficient"
  console.log(transfer.result.failureDetail.message);
}

// Get financial transaction reference after completion
if (transfer.result.status === "completed") {
  console.log(transfer.result.financialTransactionReference);
}
```

### List Internal Transfers

```typescript
// List all transfers
const transfers = await client.internalTransfer.list();

// Filter by status
const completedTransfers = await client.internalTransfer.list({
  status: "completed",
});

// Filter by source account
const fromOperational = await client.internalTransfer.list({
  sourceFinancialAccountId: "fa-operational-float",
});

// Filter by destination account
const toUserWallet = await client.internalTransfer.list({
  destinationFinancialAccountId: "fa-user-wallet-123",
});

// Filter by transaction reference
const byReference = await client.internalTransfer.list({
  financialTransactionReference: "txn-ref-123",
});

// Combined filters with pagination
const transfers = await client.internalTransfer.list({
  status: "failed",
  sourceFinancialAccountId: "fa-operational-float",
  limit: 20,
});

// Paginate through all transfers
let after: string | null = null;
do {
  const response = await client.internalTransfer.list({
    limit: 50,
    ...(after && { after }),
  });

  for (const transfer of response.result) {
    console.log(transfer.id, transfer.status, transfer.amount.value);
  }

  after = response.pagination.next;
} while (after);
```

### Update an Internal Transfer

```typescript
// Update description and metadata
const transfer = await client.internalTransfer.update("trn-transfer-id", {
  description: "Updated transfer description",
  metadata: {
    updatedBy: "admin",
    note: "Corrected transfer details",
  },
});
```

### Delete an Internal Transfer

```typescript
// Only works for pending transfers
await client.internalTransfer.delete("trn-transfer-id");
```

### Common Use Cases

```typescript
// 1. Float management - move funds between disbursement accounts
const floatTransfer = await client.internalTransfer.create({
  amount: { currency: "SLE", value: 5000000 },
  sourceFinancialAccount: { id: "fa-main-float" },
  destinationFinancialAccount: { id: "fa-disbursement-float" },
  description: "Replenish disbursement float",
});

// 2. Internal settlement between business units
const settlement = await client.internalTransfer.create({
  amount: { currency: "SLE", value: 250000 },
  sourceFinancialAccount: { id: "fa-sales-account" },
  destinationFinancialAccount: { id: "fa-operations-account" },
  description: "Monthly settlement - Sales to Operations",
  metadata: {
    period: "2024-01",
    invoiceId: "inv-2024-001",
  },
});

// 3. Escrow release
const escrowRelease = await client.internalTransfer.create({
  amount: { currency: "SLE", value: 100000 },
  sourceFinancialAccount: { id: "fa-escrow-account" },
  destinationFinancialAccount: { id: "fa-seller-account" },
  description: "Escrow release - Order #12345 completed",
  metadata: {
    orderId: "order-12345",
    buyerId: "buyer-abc",
    sellerId: "seller-xyz",
  },
});
```

---

## USSD OTP

USSD OTP provides phone-bound verification through a USSD dial flow, ensuring that the person interacting is the legitimate account holder.

### Create a USSD OTP

```typescript
const otp = await client.ussdOtp.create({
  authorizedPhoneNumber: "+23276123456",
  verificationMessage: "You have successfully verified your account.",
  duration: "5m", // Valid for 5 minutes
  metadata: {
    userId: "user-123",
    action: "account_verification",
  },
});

console.log(otp.result.id);
console.log(otp.result.dialCode); // e.g., "*715*12345#"
console.log(otp.result.status); // "pending"
console.log(otp.result.expireTime);

// Send the dial code to the user
console.log(`Please dial ${otp.result.dialCode} to verify your account.`);
```

### Create OTP with Custom Duration

```typescript
// Short-lived OTP (30 seconds)
const quickOtp = await client.ussdOtp.create({
  authorizedPhoneNumber: "+23276123456",
  duration: "30s",
});

// Longer OTP (10 minutes)
const longerOtp = await client.ussdOtp.create({
  authorizedPhoneNumber: "+23276123456",
  duration: "10m",
  verificationMessage: "Transaction approved. Thank you!",
});
```

### Get a USSD OTP

```typescript
const otp = await client.ussdOtp.get("uop-otp-id");

console.log(otp.result.status); // "pending", "verified", or "expired"
console.log(otp.result.dialCode);
console.log(otp.result.authorizedPhoneNumber);

// Check verification status
if (otp.result.status === "verified") {
  console.log("User has been verified!");
} else if (otp.result.status === "expired") {
  console.log("OTP expired, please request a new one.");
} else {
  console.log("Waiting for user to dial the code...");
}
```

### Poll for Verification Status

```typescript
async function waitForVerification(
  otpId: string,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const otp = await client.ussdOtp.get(otpId);

    if (otp.result.status === "verified") {
      return true;
    }

    if (otp.result.status === "expired") {
      return false;
    }

    // Wait before next check
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return false;
}

// Usage
const otp = await client.ussdOtp.create({
  authorizedPhoneNumber: "+23276123456",
});

console.log(`Please dial ${otp.result.dialCode}`);

const verified = await waitForVerification(otp.result.id);
if (verified) {
  console.log("Verification successful!");
} else {
  console.log("Verification failed or timed out.");
}
```

### List USSD OTPs

```typescript
// List all OTPs
const otps = await client.ussdOtp.list();

// List with pagination
const otps = await client.ussdOtp.list({ limit: 25 });

// Paginate through all OTPs
let after: string | null = null;
do {
  const response = await client.ussdOtp.list({
    limit: 50,
    ...(after && { after }),
  });

  for (const otp of response.result) {
    console.log(otp.id, otp.status, otp.authorizedPhoneNumber);
  }

  after = response.pagination.next;
} while (after);
```

### Delete a USSD OTP

```typescript
// Delete an OTP session (e.g., user requested cancellation)
await client.ussdOtp.delete("uop-otp-id");
```

### Common Use Cases

```typescript
// 1. User registration verification
async function verifyNewUser(phoneNumber: string) {
  const otp = await client.ussdOtp.create({
    authorizedPhoneNumber: phoneNumber,
    verificationMessage: "Welcome! Your account is now verified.",
    duration: "5m",
    metadata: { flow: "registration" },
  });

  return {
    otpId: otp.result.id,
    dialCode: otp.result.dialCode,
  };
}

// 2. Transaction authorization
async function authorizeTransaction(phoneNumber: string, amount: number) {
  const otp = await client.ussdOtp.create({
    authorizedPhoneNumber: phoneNumber,
    verificationMessage: `Transaction of ${amount} SLE approved.`,
    duration: "2m",
    metadata: {
      flow: "transaction_auth",
      amount: String(amount),
    },
  });

  return otp.result;
}

// 3. Password reset verification
async function initiatePasswordReset(phoneNumber: string) {
  const otp = await client.ussdOtp.create({
    authorizedPhoneNumber: phoneNumber,
    verificationMessage: "Password reset verified. Check your email for next steps.",
    duration: "10m",
    metadata: { flow: "password_reset" },
  });

  return otp.result.dialCode;
}
```
