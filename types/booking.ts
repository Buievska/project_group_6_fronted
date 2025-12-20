export interface CreateBookingRequest {
  toolId: string;
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  deliveryCity: string;
  deliveryBranch: string;
}

export interface CreateBookingResponse {
  id: string;
  status: "pending" | "confirmed" | "rejected";
  totalPrice: number;
}
