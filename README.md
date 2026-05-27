## Prince Education — AALA 2026 Payment

This is a **static** Prince Education checkout flow for **credit card payments**.

### Flow

- AALA collects registration details and redirects users here (e.g. `checkout.html?...`).
- This site **does not** collect card details. It forwards to the bank gateway via a **POST** to `https://secure.lusoibank.com/payment-gateway`.

### What you must configure

In `checkout.html`, set:

- `MERCHANT_ID`
- `RETURN_URL` and `CANCEL_URL` (must be URLs on this Prince site)
- (Optional) supported currencies and any required gateway fields

