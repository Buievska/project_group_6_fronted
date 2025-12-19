"use client"; // 👈 1. Робимо клієнтським

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import css from "./UserProfile.module.css";
import { useAuthStore } from "@/lib/store/authStore"; // 👈 2. Підключаємо стейт

interface UserProfileProps {
  userName: string;
  avatarUrl?: string | null;
  profileId: string; // 👈 3. Замість isOwner ми передаємо ID цього профілю
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  avatarUrl,
  profileId,
}) => {
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  // 4. Дістаємо нашого залогіненого юзера зі стейту
  const { user: currentUser } = useAuthStore();
  const [isOwner, setIsOwner] = useState(false);

  // 5. Перевіряємо, чи ми власники, вже на клієнті (де працює авторизація)
  useEffect(() => {
    if (
      currentUser &&
      (currentUser._id === profileId || currentUser.id === profileId)
    ) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [currentUser, profileId]);

  return (
    <div className={css.profileCard}>
      <div className={css.avatarSection}>
        <div className={css.avatarWrapper}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`Аватар ${userName}`}
              fill
              sizes="150px"
              className={css.avatarImage}
              priority
            />
          ) : (
            <div className={css.avatarLetter}>{avatarLetter}</div>
          )}
        </div>

        {/* Кнопка з'явиться, бо isOwner тепер true */}
        {isOwner && (
          <Link href="/profile/edit" className={css.editButton}>
            Редагувати профіль
          </Link>
        )}
      </div>

      <div className={css.infoSection}>
        <h1 className={css.userName}>{userName}</h1>
        <div className={css.statsRow}>
          <span className={css.statItem}>Активний користувач</span>
        </div>
        <div className={css.contactInfo}>
          <p className={css.subText}>Профіль учасника спільноти RentTools</p>
        </div>
      </div>
    </div>
  );
};
