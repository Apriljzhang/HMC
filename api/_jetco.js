const crypto = require("crypto");

function sha256Hex(value) {
    return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function htmlEscape(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function readRawBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}

async function parseBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }

    const raw = req.body && typeof req.body === "string" ? req.body : await readRawBody(req);
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
        return raw ? JSON.parse(raw) : {};
    }

    return Object.fromEntries(new URLSearchParams(raw));
}

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function makeAbsoluteUrl(req, path) {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return `${proto}://${host}${path}`;
}

function normaliseInvoice(value) {
    const fallback = `HMC${Date.now().toString(36).toUpperCase()}`;
    return String(value || fallback)
        .replace(/[^A-Za-z0-9_-]/g, "")
        .slice(0, 18) || fallback;
}

function normaliseAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid payment amount.");
    }
    return amount.toFixed(2);
}

module.exports = {
    htmlEscape,
    makeAbsoluteUrl,
    normaliseAmount,
    normaliseInvoice,
    parseBody,
    requireEnv,
    sha256Hex,
};
