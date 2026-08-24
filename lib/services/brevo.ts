interface BrevoRecipient {
  email: string;
  name?: string;
}

interface OrderItem {
  product_name?: string | null;
  size?: string | null;
  quantity?: number | null;
  price?: number | null;
}

interface OrderForEmail {
  id: number | string;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email: string;
  subtotal?: number | null;
  order_items?: OrderItem[] | null;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendOrderConfirmationEmail(
  order: OrderForEmail
) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  const firstName =
    order.customer_first_name?.trim() || "there";

  const customerName = [
    order.customer_first_name,
    order.customer_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const items = order.order_items ?? [];

  const itemRows = items
    .map((item) => {
      const productName = escapeHtml(item.product_name);
      const size = escapeHtml(item.size || "—");
      const quantity = Number(item.quantity ?? 0);
      const price = Number(item.price ?? 0);

      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;">
            ${productName}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:center;">
            ${size}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:center;">
            ${quantity}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:right;">
            R ${price.toLocaleString("en-ZA")}
          </td>
        </tr>
      `;
    })
    .join("");

  const subtotal = Number(order.subtotal ?? 0);

  const htmlContent = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#ffffff;color:#111111;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:620px;margin:0 auto;padding:48px 24px;">
          <div style="text-align:center;margin-bottom:48px;">
            <div style="font-size:22px;letter-spacing:0.35em;">
              VÚJ
            </div>
          </div>

          <h1 style="font-size:28px;font-weight:400;margin:0 0 24px;">
            Thank you for your order.
          </h1>

          <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
            Hi ${escapeHtml(firstName)},
          </p>

          <p style="font-size:15px;line-height:1.7;margin:0 0 32px;">
            We've received your order and your payment has been confirmed.
          </p>

          <div style="font-size:14px;margin-bottom:32px;">
            <strong>Order #${escapeHtml(order.id)}</strong>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr>
                <th style="padding:0 0 12px;text-align:left;font-weight:400;">Item</th>
                <th style="padding:0 0 12px;text-align:center;font-weight:400;">Size</th>
                <th style="padding:0 0 12px;text-align:center;font-weight:400;">Qty</th>
                <th style="padding:0 0 12px;text-align:right;font-weight:400;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div style="text-align:right;margin-top:24px;font-size:16px;">
            <strong>Total&nbsp;&nbsp; R ${subtotal.toLocaleString("en-ZA")}</strong>
          </div>

          <p style="font-size:14px;line-height:1.7;margin:40px 0 0;">
            We'll be in touch with further order updates.
          </p>

          <div style="margin-top:56px;padding-top:24px;border-top:1px solid #e5e5e5;font-size:12px;line-height:1.6;">
            <strong>VÚJ</strong><br />
            Exclusively made in Cape Town.
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = [
    "VÚJ",
    "",
    `Thank you for your order, ${customerName || firstName}.`,
    "Your payment has been confirmed.",
    "",
    `Order #${order.id}`,
    "",
    ...items.map((item) =>
      `${item.product_name ?? "Item"} — Size ${item.size ?? "—"} — Qty ${item.quantity ?? 0} — R ${Number(item.price ?? 0).toLocaleString("en-ZA")}`
    ),
    "",
    `Total: R ${subtotal.toLocaleString("en-ZA")}`,
    "",
    "We'll be in touch with further order updates.",
    "",
    "VÚJ",
    "Exclusively made in Cape Town.",
  ].join("\n");

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "VÚJ",
          email: "info@vujlabel.com",
        },
        replyTo: {
          name: "VÚJ",
          email: "info@vujlabel.com",
        },
        to: [
          {
            email: order.customer_email,
            name: customerName || undefined,
          } satisfies BrevoRecipient,
        ],
        subject: `VÚJ — Order #${order.id} confirmed`,
        htmlContent,
        textContent,
        tags: ["order-confirmation"],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Brevo email failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}
