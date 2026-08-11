import crypto from "crypto";

const merchantId = process.env.PAYFAST_MERCHANT_ID!;
const merchantKey = process.env.PAYFAST_MERCHANT_KEY!;
const passphrase = process.env.PAYFAST_PASSPHRASE!;

export interface PayFastPayment {
  amount: number;
  itemName: string;
  paymentId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
}

export function payfastHost() {
  return process.env.PAYFAST_SANDBOX === "true"
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

export function generatePaymentData(
  payment: PayFastPayment
) {
  const data: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,

    return_url:
      "http://localhost:3000/payment/success",

    cancel_url:
      "http://localhost:3000/payment/cancel",

    notify_url:
      "http://localhost:3000/api/payfast/notify",

    m_payment_id: payment.paymentId,

    amount: payment.amount.toFixed(2),

    item_name: payment.itemName,

    name_first: payment.customerFirstName,

    name_last: payment.customerLastName,

    email_address: payment.customerEmail,
  };

  data.signature = generateSignature(data);

  return data;
}

function generateSignature(
  data: Record<string, string>
) {
  const output = Object.entries(data)
    .filter(
      ([key, value]) =>
        key !== "signature" &&
        value !== ""
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(value).replace(
          /%20/g,
          "+"
        )}`
    )
    .join("&");

  const string =
    output +
    `&passphrase=${encodeURIComponent(passphrase)}`;

  return crypto
    .createHash("md5")
    .update(string)
    .digest("hex");
}

export function verifySignature(
  data: Record<string, string>
) {
  const receivedSignature = data.signature;

  if (!receivedSignature) {
    return false;
  }

  const payload = { ...data };

  delete payload.signature;

  const expectedSignature =
    generateSignature(payload);

  return (
    expectedSignature.toLowerCase() ===
    receivedSignature.toLowerCase()
  );
}

export function getMerchantId() {
  return merchantId;
}

export function verifyAmount(
  expected: number,
  received: string
) {
  return (
    expected.toFixed(2) ===
    Number(received).toFixed(2)
  );
}