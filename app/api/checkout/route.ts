import { NextResponse } from "next/server";
import {
  generatePaymentData,
  payfastHost,
} from "../../../lib/services/payfast";
import { getOrder } from "../../../lib/services/orders";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order ID." },
        { status: 400 }
      );
    }

    const order = await getOrder(orderId);

    const payment = generatePaymentData({
      paymentId: String(order.id),
      amount: Number(order.subtotal) ,
      itemName: `VÚJ Order #${order.id}`,
      customerFirstName: order.customer_first_name,
      customerLastName: order.customer_last_name,
      customerEmail: order.customer_email,
    });

    return NextResponse.json({
      gateway: payfastHost(),
      fields: payment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create payment.",
      },
      {
        status: 500,
      }
    );
  }
}