import { NextRequest, NextResponse } from "next/server";

import { createOrder } from "@/lib/services/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const order = await createOrder(
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        subtotal: body.subtotal,
      },
      body.items
    );

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create order.",
      },
      {
        status: 500,
      }
    );
  }
}