import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";

import { getUserProfile, getUserTools } from "@/lib/api/serverApi";
import ProfileTabs from "@/components/ProfileTabs/ProfileTabs";

import css from "./Profile.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  try {
    const user = await getUserProfile(userId);
    return {
      title: `${user.name} | Профіль`,
      description: `Перегляд інструментів користувача ${user.name}.`,
    };
  } catch {
    return { title: "Профіль не знайдено" };
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  try {
    const [targetUser, toolsData] = await Promise.all([
      getUserProfile(userId),
      getUserTools(userId),
    ]);

    const initialTools = toolsData?.tools || [];
    const totalCount = toolsData?.total || 0;

    return (
      <main className={css.mainContent}>
        <ProfileTabs
          user={targetUser}
          initialTools={initialTools}
          totalToolsCount={totalCount}
          userId={userId}
        />
      </main>
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      notFound();
    }

    return (
      <main className={css.mainContent}>
        <div className={css.errorContainer}>
          <p>Не вдалося завантажити профіль користувача.</p>
          <Link href="/" className={css.backLink}>
            Повернутися на головну
          </Link>
        </div>
      </main>
    );
  }
}
