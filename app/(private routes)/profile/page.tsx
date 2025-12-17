// app/(private routes)/profile/page.tsx
import { getCurrentAuthUser } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Мій Профіль | Tool",
  description: "Особиста сторінка профілю поточного користувача.",
};

export default async function MyProfilePage() {
  let user = null;

  try {
    user = await getCurrentAuthUser();
  } catch (error) {
    console.error("Failed to fetch current user for redirect:", error);
  }

  if (user && user.id) {
    redirect(`/profile/${user.id}`);
  }

  return (
    <main>
      <h1>Помилка авторизації</h1>
      <p>
        Не вдалося отримати дані користувача для перенаправлення. Спробуйте
        увійти знову.
      </p>

      <a href="/login">Перейти до входу</a>
    </main>
  );
}
