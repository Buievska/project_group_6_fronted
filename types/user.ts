export type User = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface UserProfile {
  id: string;
  _id: string;
  email: string;
  name: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  phone?: string;
  role?: "user" | "admin";
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}
