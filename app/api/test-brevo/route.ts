import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/services/brevo";

export async function GET() {
  try {
    await sendOrderConfirmationEmail({
      id: "TEST-001",
      customer_first_name: "VÚJ",
      customer_last_name: "Test",
      customer_email: "chestuurmanmoses@gmail.com",
      subtotal: 1890,
      order_items: [
        {
          product_name: "Test Product",
          size: "S",
          quantity: 1,
          price: 1890,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Brevo test email sent successfully.",
    });
  } catch (error) {
    console.error("Brevo test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}