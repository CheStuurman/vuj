import { NextRequest, NextResponse } from "next/server";

import {
  verifySignature,
  getMerchantId,
  verifyAmount,
} from "@/lib/services/payfast";

import {
  getOrder,
  markOrderPaid,
} from "@/lib/services/orders";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const data = Object.fromEntries(
      form.entries()
    ) as Record<string, string>;

    console.log("==================================");
    console.log("PAYFAST ITN RECEIVED");
    console.log(data);
    console.log("==================================");

    // STEP 1
    // Verify signature
    if (!verifySignature(data)) {
      console.error("Invalid PayFast signature.");

      return new NextResponse(
        "INVALID SIGNATURE",
        {
          status: 400,
        }
      );
    }

    // STEP 2
    // Verify merchant
    if (
      data.merchant_id !== getMerchantId()
    ) {
      console.error("Merchant mismatch.");

      return new NextResponse(
        "INVALID MERCHANT",
        {
          status: 400,
        }
      );
    }

    // STEP 3
    // Find order
    const order = await getOrder(
      data.m_payment_id
    );

    if (!order) {
      console.error("Order not found.");

      return new NextResponse(
        "ORDER NOT FOUND",
        {
          status: 404,
        }
      );
    }

    // STEP 4
    // Verify amount
    if (
      !verifyAmount(
        Number(order.subtotal),
        data.amount_gross
      )
    ) {
      console.error("Amount mismatch.");

      return new NextResponse(
        "INVALID AMOUNT",
        {
          status: 400,
        }
      );
    }

    // STEP 5
    // Mark order paid
    if (
      data.payment_status === "COMPLETE"
    ) {
      await markOrderPaid(order.id);

      console.log(
        `Order ${order.id} marked as PAID`
      );
    }

    return new NextResponse("OK", {
      status: 200,
    });
  } catch (error) {
    console.error(
      "PayFast ITN Error:",
      error
    );

    return new NextResponse("ERROR", {
      status: 500,
    });
  }
}