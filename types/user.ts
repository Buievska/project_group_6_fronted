export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string;
  role?: "user" | "admin";
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}
