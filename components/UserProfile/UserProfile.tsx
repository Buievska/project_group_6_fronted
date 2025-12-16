// components/UserProfile/UserProfile.tsx
import Image from "next/image";
import React from "react";
import css from "./UserProfile.module.css";

interface UserProfileProps {
  userName: string;
  avatarUrl?: string | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  avatarUrl,
}) => {
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  const useImage = !!avatarUrl;

  return (
    <div className={css.profileContainer}>
      {useImage && avatarUrl ? (
        <div className={css.avatarWrapper}>
          <Image
            src={avatarUrl}
            alt={`Аватар користувача ${userName}`}
            fill
            sizes="96px"
            className={css.avatarImage}
            priority
          />
        </div>
      ) : (
        <div className={css.avatarWrapper}>
          <div className={css.avatarLetter}>{avatarLetter}</div>
        </div>
      )}
      <div className={css.nameContainer}>
        <h1 className={css.userName}>{userName}</h1>
        <p className={css.subText}>Профіль користувача</p>
      </div>
    </div>
  );
};
