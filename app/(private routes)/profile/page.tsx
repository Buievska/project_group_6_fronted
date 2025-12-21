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

  if (isLoading) {
    return (
      <main className={styles.container}>
        <span className={styles.spinner}></span>
      </main>
    );
  }

  return (
    <main style={{ padding: "50px", textAlign: "center" }}>
      <h1>Помилка авторизації</h1>
      <p>
        Не вдалося знайти ваш профіль. Можливо, термін дії сесії закінчився.
      </p>
      <Link
        href="/login"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        Перейти до входу
      </Link>
    </main>
  );
}
