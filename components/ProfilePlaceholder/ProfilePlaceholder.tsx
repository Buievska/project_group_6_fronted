// components/ProfilePlaceholder/ProfilePlaceholder.tsx

import Link from "next/link";
import React from "react";
import css from "./ProfilePlaceholder.module.css";

interface ProfilePlaceholderProps {
  isOwner: boolean;
}

export const ProfilePlaceholder: React.FC<ProfilePlaceholderProps> = ({
  isOwner,
}) => {
  let textContent;
  if (isOwner) {
    textContent = (
      <p className={css.placeholderText}>
        У вас поки що немає опублікованих інструментів. Створіть свій перший
        інструмент і поділіться ним зі світом.
      </p>
    );
  } else {
    textContent = (
      <p className={css.placeholderText}>
        У цього користувача ще не опубліковано жодного інструменту.
        <br className={css.textBreak} />
        <span className={css.highlightSpan}>
          У нас є великий вибір інструментів від інших користувачів.
        </span>
      </p>
    );
  }

  const linkText = isOwner ? "Опублікувати інструмент" : "Всі інструменти";
  const href = isOwner ? "/tools/new" : "/";

  return (
    <div className={css.placeholderContainer}>
      <div className={css.textWrapper}>{textContent}</div>
      <Link href={href} className={css.placeholderButton}>
        {linkText}
      </Link>
    </div>
  );
};
