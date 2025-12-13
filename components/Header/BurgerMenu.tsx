"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

type User = {
  name: string;
  avatar?: string | null;
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
        {/* LOGO */}
        <div className={styles.menuHeader}>
          <Link href="/" className={styles.logoLink} onClick={onClose}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className={styles.navMobile}>
          <Link href="/" onClick={onClose}>
            Головна
          </Link>
          <Link href="/tools" onClick={onClose}>
            Інструменти
          </Link>

          {!user && (
            <Link href="/auth/login" onClick={onClose}>
              Увійти
            </Link>
          )}

          {user && (
            <>
              <Link href="/profile" onClick={onClose}>
                Мій профіль
              </Link>
              <Link href="/create" onClick={onClose}>
                Опублікувати оголошення
              </Link>
              <button
                className={styles.registerMobile}
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
              >
                Вийти
              </button>
            </>
          )}
        </nav>

        {!user && (
          <div className={styles.authMobile}>
            <Link
              href="/auth/register"
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
