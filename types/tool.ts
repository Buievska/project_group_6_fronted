export interface ToolFormValues {
  name: string;
  pricePerDay: number;

  categoryId: string | number;

  description: string;

  terms: string;

  specifications?: string;

  images: File | null;
}

export interface Tool {
  _id: string;
  name: string;
  pricePerDay: number;
  description: string;
  terms: string;
  specifications?: string;
  images: string;
  rating: number;
  category: {
    id: string | number;
    name: string;
  };
  ownerId: string;
  feedbacks: {
    rate: number;
  };
}
