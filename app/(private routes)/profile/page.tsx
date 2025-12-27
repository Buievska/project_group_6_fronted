"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./MyProfilePage.module.css";

export default function MyProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const loginToStore = useAuthStore((state) => state.login);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();

        if (userData) {
          const user = userData.data || userData;
          loginToStore(user);

          const userId = user._id || user.id;
          router.push(`/profile/${userId}`);
        }
      } catch (error) {
        console.error("Не вдалося авторизуватись:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, loginToStore]);
}
