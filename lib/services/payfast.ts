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
    // Merchant details
    merchant_id: merchantId,
    merchant_key: merchantKey,

    return_url:
       "https://www.vujlabel.com/payment/success",

    cancel_url:
       "https://www.vujlabel.com/payment/cancel",

    notify_url:
  "https://www.vujlabel.com/api/payfast/notify",

    // Buyer details
    name_first: payment.customerFirstName,
    name_last: payment.customerLastName,
    email_address: payment.customerEmail,

    // Transaction details
    m_payment_id: payment.paymentId,
    amount: payment.amount.toFixed(2),
    item_name: payment.itemName,
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
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(
          value.trim()
        ).replace(/%20/g, "+")}`
    )
    .join("&");

  const string = passphrase
    ? `${output}&passphrase=${encodeURIComponent(
        passphrase.trim()
      ).replace(/%20/g, "+")}`
    : output;

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