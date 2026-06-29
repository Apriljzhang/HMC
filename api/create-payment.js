const {
    htmlEscape,
    makeAbsoluteUrl,
    normaliseAmount,
    normaliseInvoice,
    parseBody,
    requireEnv,
    sha256Hex,
} = require("./_jetco");

function renderAutoSubmitForm(payPageUrl, fields) {
    const inputs = Object.keys(fields).map((key) => {
        return `<input type="hidden" name="${htmlEscape(key)}" value="${htmlEscape(fields[key])}">`;
    }).join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to payment</title>
</head>
<body>
    <p>Redirecting to the secure payment page...</p>
    <form id="jetcoPaymentForm" method="POST" action="${htmlEscape(payPageUrl)}">
        ${inputs}
        <noscript><button type="submit">Continue to payment</button></noscript>
    </form>
    <script>document.getElementById("jetcoPaymentForm").submit();</script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const body = await parseBody(req);
        const merchantId = requireEnv("JETCO_MERCHANT_ID");
        const hashSeed = requireEnv("JETCO_HASH_SEED");
        const payPageUrl = requireEnv("JETCO_PAYPAGE_URL");

        const invoice = normaliseInvoice(body.orderId);
        const amount = normaliseAmount(body.amount);
        const currencyCode = process.env.JETCO_CURRENCY_CODE || "446";
        const locale = process.env.JETCO_LOCALE || "en_us";
        const transactionType = process.env.JETCO_TRANSACTION_TYPE || "7";
        const cardType = process.env.JETCO_CARD_TYPE || "";
        const returnUrl = process.env.JETCO_RETURN_URL || makeAbsoluteUrl(req, "/jetco-return");

        if (body.currency && body.currency !== "MOP") {
            throw new Error("Only MOP payments are currently configured.");
        }

        const hashInput = merchantId
            + invoice
            + amount
            + currencyCode
            + locale
            + transactionType
            + cardType
            + returnUrl
            + hashSeed;

        const fields = {
            mid: merchantId,
            inv: invoice,
            amt: amount,
            cur: currencyCode,
            loc: locale,
            tt: transactionType,
            ct: cardType,
            rurl: returnUrl,
            hv: sha256Hex(hashInput),
        };

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(200).send(renderAutoSubmitForm(payPageUrl, fields));
    } catch (error) {
        res.status(400).send(htmlEscape(error.message || "Unable to create payment."));
    }
};
