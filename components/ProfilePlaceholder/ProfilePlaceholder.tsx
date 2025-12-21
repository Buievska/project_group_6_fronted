import Link from "next/link";
import React from "react";
import css from "./ProfilePlaceholder.module.css";

interface ProfilePlaceholderProps {
  isOwner: boolean;
  variant?: "tools" | "bookings";
}

export const ProfilePlaceholder: React.FC<ProfilePlaceholderProps> = ({
  isOwner,
  variant = "tools",
}) => {
  let textContent;
  let linkText;
  let href;

  if (variant === "bookings") {
    textContent = (
      <p className={css.placeholderText}>
        У вас поки немає активних бронювань.
        <br className={css.textBreak} />
        <span className={css.highlightSpan}>
          Знайдіть потрібний інструмент у каталозі та забронюйте його!
        </span>
      </p>
    );
    linkText = "Перейти до каталогу";
    href = "/tools";
  } else {
    if (isOwner) {
      textContent = (
        <p className={css.placeholderText}>
          У вас поки що немає опублікованих інструментів. Створіть свій перший
          інструмент і поділіться ним зі світом.
        </p>
      );
      linkText = "Опублікувати інструмент";
      href = "/tools/new";
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
      linkText = "Всі інструменти";
      href = "/";
    }
  }

  return (
    <div className={css.placeholderContainer}>
      <div className={css.textWrapper}>{textContent}</div>
      <Link href={href} className={css.placeholderButton}>
        {linkText}
      </Link>
    </div>
  );
};
