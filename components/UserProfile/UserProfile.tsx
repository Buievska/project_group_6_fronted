"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StarRating from "../FeedbacksBlock/StarRating";
import css from "./UserProfile.module.css";
import { useAuthStore } from "@/lib/store/authStore";

interface UserProfileProps {
  userName: string;
  avatarUrl?: string | null;
  profileId: string;
  averageRating?: number;
  totalFeedbacks?: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  avatarUrl,
  profileId,
  averageRating = 0,
  totalFeedbacks = 0,
}) => {
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  const { user: currentUser } = useAuthStore();
  const [isOwner, setIsOwner] = useState(false);

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

        {isOwner && (
          <Link href="/profile/edit" className={css.editButton}>
            Редагувати профіль
          </Link>
        )}
      </div>

      <div className={css.infoSection}>
        <h1 className={css.userName}>{userName}</h1>
        {/* <div className={css.statsRow}>
          <span className={css.statItem}>Активний користувач</span>
        </div>
        <div className={css.contactInfo}>
          <p className={css.subText}>Профіль учасника спільноти ToolNext</p>
        </div> */}

           {/* Блок з рейтингом */}
           <div className={css.ratingSection}>
          {totalFeedbacks > 0 ? (
            <>
              <div className={css.starsWrapper}>
                <StarRating rating={averageRating} />
                <span className={css.ratingNumber}>{averageRating.toFixed(1)}</span>
              </div>
              <p className={css.feedbacksCount}>
                {totalFeedbacks} {totalFeedbacks === 1 ? 'відгук' : 
                  totalFeedbacks < 5 ? 'відгуки' : 'відгуків'}
              </p>
            </>
          ) : (
            <div className={css.noFeedbacks}>
              <p className={css.noFeedbacksText}>
                У цього користувача немає жодного відгуку.
              </p>
              <p className={css.noFeedbacksSubtext}>
                Ми впевнені скоро їх буде значно більше!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
