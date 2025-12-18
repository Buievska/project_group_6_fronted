// app/(private routes)/profile/page.tsx
import { getCurrentAuthUser } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Мій Профіль | Tool",
  description: "Особиста сторінка профілю поточного користувача.",
};

export default async function MyProfilePage() {
  const user = await getCurrentAuthUser();

  if (user && user.id) {
    redirect(`/profile/${user.id}`);
  }

  return (
    <main>
      <h1>Помилка авторизації</h1>
      <p>
        Не вдалося знайти ваш профіль. Можливо, термін дії сесії закінчився.
      </p>
      <Link href="/login">Перейти до входу</Link>
    </main>
  );
}
