# Migration Guide: TypeScript to JS + JSDoc

This migration is now implemented in the codebase. Runtime source files are JavaScript, public types are shipped from `src/index.d.ts`, and runtime validation still uses `valibot`.

## Status

- Runtime source: `.js` in `src/`
- Type surface: `src/index.d.ts` copied to `dist/index.d.ts`
- Build entry: `src/index.js`
- Type checking: `tsc --noEmit` over JSDoc + `.d.ts`

---

## Part 1: Dependency Changes

### Kept

- `valibot` (runtime validation)
- `typescript` + `@types/node` (JSDoc typecheck)
- `esbuild` (bundle)
- `@biomejs/biome` (format/lint)

### Removed

- `dts-bundle-generator`

---

## Part 2: Build Pipeline

### Build flow

```text
src/*.js        --esbuild-->  dist/index.js
src/index.d.ts  ----cp----->  dist/index.d.ts
```

### Package scripts

```json
{
  "scripts": {
    "format": "biome check --write .",
    "format:check": "biome check .",
    "typecheck": "tsc --noEmit",
    "build": "npm run build:js && npm run build:types",
    "build:js": "esbuild src/index.js --bundle --format=esm --outfile=dist/index.js --target=node20 --minify --tree-shaking=true --external:valibot",
    "build:types": "cp src/index.d.ts dist/index.d.ts",
    "build:clean": "rm -rf dist && npm run build"
  }
}
```

---

## Part 3: JSDoc Patterns (Implemented)

The migration applies JSDoc typing where it matters most for maintainability and API safety.

### Type aliases from `.d.ts`

```js
/** @typedef {import("./index.d.ts").ClientOptions} ClientOptions */
/** @typedef {import("./index.d.ts").RequestConfig} RequestConfig */
```

### Local typedefs for internal request/error shapes

```js
/** @typedef {"GET" | "POST" | "PATCH" | "DELETE"} HttpMethod */

/**
 * @typedef {object} RequestOptions
 * @property {HttpMethod} method
 * @property {string} path
 * @property {unknown} [body]
 * @property {Record<string, string | number | boolean | undefined>} [params]
 * @property {RequestConfig} [config]
 */
```

### Generic methods

```js
/**
 * @template T
 * @param {RequestOptions} options
 * @returns {Promise<T>}
 */
async request(options) {
  return this.execute_with_retry(...);
}
```

### Constructor parameter promotion replacement

```js
/** @type {number} */
timeout;

/**
 * @param {number} timeout
 * @param {string} url
 */
constructor(timeout, url) {
  this.timeout = timeout;
  this.url = url;
}
```

### Type assertions in JS

```js
const error_response = /** @type {ApiErrorResponse} */ (data);
return /** @type {T} */ (data);
```

### Implemented locations

- `src/http-client.js`
- `src/errors.js`
- `src/client.js`

---

## Part 4: File Migration Result

Converted runtime files:

- `bank.js`
- `checkout-session.js`
- `client.js`
- `errors.js`
- `financial-account.js`
- `financial-transaction.js`
- `http-client.js`
- `index.js`
- `internal-transfer.js`
- `momo.js`
- `payment-code.js`
- `payment.js`
- `payout.js`
- `receipt.js`
- `schemas.js`
- `ussd-otp.js`
- `validation.js`
- `webhook.js`

Type declarations:

- `index.d.ts` (published)

---

## Part 5: Verification

```bash
npm run format:check
npm run typecheck
npm run build:clean
```

Expected outputs:

- `dist/index.js`
- `dist/index.d.ts`
