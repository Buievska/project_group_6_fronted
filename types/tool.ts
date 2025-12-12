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
  id: string;
  name: string;
  pricePerDay: number;
  description: string;
  terms: string;
  specifications?: string;
  imageUrl: string;
  category: {
    id: string | number;
    name: string;
  };
  ownerId: string;
}
