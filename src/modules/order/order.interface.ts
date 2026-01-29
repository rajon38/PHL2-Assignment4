export interface CreateOrderItemInput {
  mealId: string;
  quantity: number;
}

export interface CreateOrderInput {
  providerId: string;
  deliveryAddress: string;
  paymentMethod?: "COD";
  items: CreateOrderItemInput[];
}