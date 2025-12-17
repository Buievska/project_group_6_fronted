export type User = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string;
  role?: "user" | "admin";
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}
