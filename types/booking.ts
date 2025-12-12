export interface BookingFormValues {
  toolId: string | number;

  firstName: string;

  lastName: string;

  phone: string;

  startDate: string;

  endDate: string;

  deliveryCity: string;

  deliveryBranch: string;
}

export interface BookingResponse {
  id: string;
  status: "pending" | "confirmed" | "rejected";
  totalPrice: number;
}
