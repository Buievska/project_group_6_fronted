import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";

import {
  getUserProfile,
  getUserTools,
  getCurrentAuthUser,
} from "@/lib/api/serverApi";

import { UserProfile } from "@/components/UserProfile/UserProfile";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";
import { ProfilePlaceholder } from "@/components/ProfilePlaceholder/ProfilePlaceholder";

import css from "./Profile.module.css";

const TOOLS_PER_PAGE = 8;

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
    const [targetUser, toolsData, currentAuthUser] = await Promise.all([
      getUserProfile(userId),
      getUserTools(userId),
      getCurrentAuthUser(),
    ]);

    const initialTools = toolsData?.tools || [];
    const totalCount = toolsData?.total || 0;

    const isOwner =
      currentAuthUser && String(currentAuthUser.id) === String(targetUser.id);
    const hasTools = initialTools.length > 0;

    return (
      <main className={css.mainContent}>
        <section className={css.profileHeader}>
          <UserProfile
            userName={targetUser.name}
            avatarUrl={targetUser.avatar}
            isOwner={!!isOwner}
          />
        </section>

        <h2 className={css.sectionTitle}>Інструменти користувача</h2>

        {hasTools ? (
          <ToolsGrid
            userId={userId}
            initialTools={initialTools}
            totalToolsCount={totalCount}
            limit={TOOLS_PER_PAGE}
          />
        ) : (
          <ProfilePlaceholder isOwner={!!isOwner} />
        )}
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
