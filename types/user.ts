export type User = {
  _id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface UserProfile extends User {
  avatar?: string | null;
  avatarUrl?: string | null; 
  phone?: string;
  role?: "user" | "admin";
  rating?: number;
  reviewsCount?: number;
  id?: string;
}