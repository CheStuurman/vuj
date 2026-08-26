import { supabase } from "../supabase";

export interface CreateOrderInput {
  firstName: string;
  lastName: string;
  email: string;
  subtotal: number;
}

export interface CreateOrderItemInput {
  productId: number;
  productName: string;
  size: string;
  quantity: number;
  price: number;
}

export async function createOrder(
  order: CreateOrderInput,
  items: CreateOrderItemInput[]
) {
  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_first_name: order.firstName,
      customer_last_name: order.lastName,
      customer_email: order.email,
      subtotal: order.subtotal,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems = items.map((item) => ({
    order_id: createdOrder.id,
    product_id: item.productId,
    product_name: item.productName,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  return createdOrder;
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function markOrderPaid(id: string) {
  const order = await getOrder(id);

  if (order.status === "paid") {
    console.log(`Order ${id} already paid.`);
    return order;
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function markOrderCancelled(id: string) {
  const order = await getOrder(id);

  if (order.status === "cancelled") {
    console.log(`Order ${id} already cancelled.`);
    return order;
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}