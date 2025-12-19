"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

type User = {
  name: string;
  avatar?: string | null;
  avatarUrl?: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onLogout?: () => void;
};

export default function BurgerMenu({ isOpen, onClose, user, onLogout }: Props) {
  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.menuHeader}>
          <Link href="/" className={styles.logoLink} onClick={onClose}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>
        </div>

        <nav className={styles.navMobile}>
          <Link href="/" onClick={onClose}>
            Головна
          </Link>
          <Link href="/tools" onClick={onClose}>
            Інструменти
          </Link>

          {!user && (
            <Link href="/login" onClick={onClose}>
              Увійти
            </Link>
          )}

          {user && (
            <Link href="/profile" onClick={onClose}>
              Мій профіль
            </Link>
          )}
        </nav>

        {user && (
          <div className={styles.mobileUserCentered}>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || "User"}
                width={32}
                height={32}
                className={styles.mobileAvatar}
              />
            ) : (
              <div className={styles.mobileInitial}>
                {(user.name?.charAt(0) || "U").toUpperCase()}
              </div>
            )}

            <span className={styles.mobileUserName}>
              {user.name || "Користувач"}
            </span>

            <Image
              src="/icon-exit.svg"
              alt=""
              width={1}
              height={39}
              className={styles.mobileDivider}
            />

            <button
              className={styles.mobileLogout}
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              aria-label="Вийти"
            >
              <Image src="/button-exit.svg" alt="" width={24} height={24} />
            </button>
          </div>
        )}

        {!user && (
          <div className={styles.authMobile}>
            <Link
              href="/register"
              onClick={onClose}
              className={styles.registerMobile}
            >
              Зареєструватися
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
