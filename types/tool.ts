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
  owner: string;
  name: string;
  pricePerDay: number;
  description: string;
  terms: string;
  specifications?: string | Record<string, string | number>;
  images: string;
  rating: number;
  category: {
    id: string | number;
    name: string;
  };
  ownerId: string;
  feedbacks?: {
    rate: number;
  };
  rentalTerms?: string;
  bookedDates: {
    from: string;
    to: string;
    userId: string;
  }[];
}
export interface ToolFormInitialValues {
  name: string;
  pricePerDay: number;
  categoryId: string | number; // може бути будь-яким з API
  terms: string;
  description: string;
  specifications: string;
  imageUrl?: string; // для показу поточного зображення
}
