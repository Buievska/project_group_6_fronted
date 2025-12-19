// components/UserProfile/UserProfile.tsx

import Image from "next/image";
import Link from "next/link";
import React from "react";
import css from "./UserProfile.module.css";

interface UserProfileProps {
  userName: string;
  avatarUrl?: string | null;
  isOwner: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  avatarUrl,
  isOwner,
}) => {
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "?";

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
