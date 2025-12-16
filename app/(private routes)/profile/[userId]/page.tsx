// app/(private routes)/profile/[userId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getUserProfile,
  getUserTools,
  getCurrentAuthUser,
  getTotalToolsCount,
  UserProfile as ApiUserProfile, // Імпортуємо коректний тип
  ToolData as ApiToolData, // Імпортуємо коректний тип
} from "@/lib/api/serverApi";

import { UserProfile } from "@/components/UserProfile/UserProfile";
import { ToolsGrid } from "@/components/ToolsGrid/ToolsGrid";
import { ProfilePlaceholder } from "@/components/ProfilePlaceholder/ProfilePlaceholder";

import css from "./Profile.module.css";

// --- Конфігурація для пагінації ---
const TOOLS_PER_PAGE = 8;

// --- Типи даних (Використовуємо імпортовані типи для узгодженості) ---
type UserData = ApiUserProfile;
type ToolData = ApiToolData;

export const dynamic = "force-dynamic";

// --- 1. Генерація Метаданих (SEO) ---
export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  // ✅ ВИПРАВЛЕНО: Прибрано await
  const { userId } = params;

  try {
    const user = await getUserProfile(userId);
    return {
      title: `${user.name}'s Profile | Tool`,
      description: `View tools and profile information for user ${user.name}.`,
    };
  } catch {
    return {
      title: "Profile Not Found | Tool",
    };
  }
}

// --- 2. Основний компонент сторінки (Server Component) ---
export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  // ✅ ВИПРАВЛЕНО: Прибрано await
  const { userId } = params;

  let targetUser: UserData | null = null;
  let initialTools: ToolData[] = [];
  let currentAuthUser: UserData | null = null;
  let totalToolsCount: number = 0;

  try {
    // Отримання даних паралельно на сервері
    [targetUser, initialTools, currentAuthUser, totalToolsCount] =
      await Promise.all([
        getUserProfile(userId),
        getUserTools(userId, { limit: TOOLS_PER_PAGE, offset: 0 }),
        getCurrentAuthUser(),
        getTotalToolsCount(userId),
      ]);
  } catch (error) {
    // Обробка 404 помилки
    if (error instanceof Error && (error as any).status === 404) {
      notFound();
    }
    console.error("Failed to fetch profile data:", error);
    return (
      <main className={css.mainContent}>
        <div className={css.errorText}>Помилка завантаження профілю.</div>
      </main>
    );
  }

  if (!targetUser) {
    notFound();
  } // 3. Логіка визначення власника та наявності інструментів

  const isOwner = currentAuthUser?.id === targetUser.id;
  const hasTools = totalToolsCount > 0;

  return (
    <main className={css.mainContent}>
      <section className={css.profileHeader}>
        {/* UserProfile: Відображає ім'я та аватар (фото або ініціал) */}
        <UserProfile
          userName={targetUser.name}
          avatarUrl={targetUser.avatar} // ✅ ВИПРАВЛЕНО: Використовуємо 'avatar'
        />
        {/* Кнопка "Редагувати профіль" відображається лише для власника */}
        {isOwner && (
          <Link href="/profile/edit" className={css.editProfileButton}>
            Редагувати
          </Link>
        )}
      </section>
      <h2 className={css.sectionTitle}>Інструменти</h2>
      {hasTools ? (
        // ToolsGrid (Client Component) тепер обробляє відображення першої порції
        // та логіку підвантаження ("Показати більше") через React Query
        <ToolsGrid
          userId={userId}
          initialTools={initialTools}
          totalToolsCount={totalToolsCount}
          limit={TOOLS_PER_PAGE}
        />
      ) : (
        // ProfilePlaceholder (SC/CC) для порожнього стану
        <ProfilePlaceholder isOwner={isOwner} />
      )}
    </main>
  );
}
