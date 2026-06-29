const {
    htmlEscape,
    makeAbsoluteUrl,
    parseBody,
    requireEnv,
    sha256Hex,
} = require("./_jetco");

function valueOrEmpty(value) {
    return value == null ? "" : String(value);
}

function verifyResponseHash(body, hashSeed) {
    const rrNumber = valueOrEmpty(body.rn) || "null";
    const hashInput = valueOrEmpty(body.mid)
        + valueOrEmpty(body.inv)
        + valueOrEmpty(body.amt)
        + valueOrEmpty(body.cur)
        + valueOrEmpty(body.tt)
        + valueOrEmpty(body.loc)
        + valueOrEmpty(body.rc)
        + rrNumber
        + valueOrEmpty(body.eci)
        + valueOrEmpty(body.sts)
        + valueOrEmpty(body.cip)
        + valueOrEmpty(body.cb)
        + valueOrEmpty(body.ac)
        + valueOrEmpty(body.lstn)
        + valueOrEmpty(body.sd)
        + valueOrEmpty(body.cbt)
        + valueOrEmpty(body.ar)
        + hashSeed;

    return sha256Hex(hashInput).toLowerCase() === valueOrEmpty(body.hv).toLowerCase();
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const body = await parseBody(req);
        const hashSeed = requireEnv("JETCO_HASH_SEED");
        const hashIsValid = verifyResponseHash(body, hashSeed);
        const approved = hashIsValid && valueOrEmpty(body.rc) === "0" && valueOrEmpty(body.sts) === "AP";

        const successUrl = process.env.SITE_SUCCESS_URL || makeAbsoluteUrl(req, "/payment-success.html");
        const failureUrl = process.env.SITE_FAILURE_URL || makeAbsoluteUrl(req, "/payment-cancelled.html");
        const target = new URL(approved ? successUrl : failureUrl);

        target.searchParams.set("invoice", valueOrEmpty(body.inv));
        target.searchParams.set("status", valueOrEmpty(body.sts));
        target.searchParams.set("response", valueOrEmpty(body.rc));
        if (!hashIsValid) {
            target.searchParams.set("verification", "failed");
        }

        res.statusCode = 303;
        res.setHeader("Location", target.toString());
        res.end();
    } catch (error) {
        res.status(400).send(htmlEscape(error.message || "Unable to process payment result."));
    }
};
