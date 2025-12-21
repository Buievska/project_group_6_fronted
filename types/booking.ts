export interface BookedRange {
  from: Date;
  to: Date;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface BookingToolFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  dateRange: DateRange;
  deliveryCity: string;
  deliveryBranch: string;
}

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
