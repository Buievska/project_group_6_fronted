// app/(private routes)/profile/[userId]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";

import {
  getUserProfile,
  getUserTools,
  getCurrentAuthUser,
  getTotalToolsCount,
  UserProfile as ApiUserProfile,
  ToolData as ApiToolData,
} from "@/lib/api/serverApi";

import { UserProfile } from "@/components/UserProfile/UserProfile";
import { ToolsGrid } from "@/components/ToolsGrid/ToolsGrid";
import { ProfilePlaceholder } from "@/components/ProfilePlaceholder/ProfilePlaceholder";

import css from "./Profile.module.css";

const TOOLS_PER_PAGE = 8;

type UserData = ApiUserProfile;
type ToolData = ApiToolData;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
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

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  let targetUser: UserData | null = null;
  let initialTools: ToolData[] = [];
  let currentAuthUser: UserData | null = null;
  let totalToolsCount: number = 0;

  try {
    [targetUser, initialTools, currentAuthUser, totalToolsCount] =
      await Promise.all([
        getUserProfile(userId),
        getUserTools(userId, { limit: TOOLS_PER_PAGE, offset: 0 }),
        getCurrentAuthUser(),
        getTotalToolsCount(userId),
      ]);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.isAxiosError && axiosError.response?.status === 404) {
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
  }

  const isOwner = currentAuthUser?.id === targetUser.id;
  const hasTools = totalToolsCount > 0;

  return (
    <main className={css.mainContent}>
      <section className={css.profileHeader}>
        <UserProfile userName={targetUser.name} avatarUrl={targetUser.avatar} />

        {isOwner && (
          <Link href="/profile/edit" className={css.editProfileButton}>
            Редагувати
          </Link>
        )}
      </section>
      <h2 className={css.sectionTitle}>Інструменти</h2>
      {hasTools ? (
        <ToolsGrid
          userId={userId}
          initialTools={initialTools}
          totalToolsCount={totalToolsCount}
          limit={TOOLS_PER_PAGE}
        />
      ) : (
        <ProfilePlaceholder isOwner={isOwner} />
      )}
    </main>
  );
}
