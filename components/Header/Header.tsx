"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import BurgerMenu from "./BurgerMenu";
import { useAuthStore } from "@/lib/store/authStore";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

export function Header() {
  const { user, logout } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.containerHeader}>
          {/* LOGO */}
          <Link href="/" className={styles.logoLink}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>

          {/* DESKTOP NAV */}
          <div className={styles.headerRight}>
            <nav className={styles.navLinks}>
              <Link href="/">Головна</Link>
              <Link href="/tools">Інструменти</Link>
              {!user && <Link href="/login">Увійти</Link>}
              {user && <Link href="/profile">Мій профіль</Link>}
              {user && <Link href="/create">Опублікувати оголошення</Link>}
            </nav>

            {!user ? (
              <Link href="/register" className={styles.register}>
                Зареєструватися
              </Link>
            ) : (
              <div className={styles.userBlock}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userInitial}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.userName}>{user.name}</span>
                <button
                  className={styles.logout}
                  onClick={() => setIsLogoutOpen(true)}
                >
                  Вийти
                </button>
              </div>
            )}
          </div>

          {/* BURGER BUTTON */}
          <button
            className={styles.burger}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Image
              src={isMenuOpen ? "/burger-close.svg" : "/burger-open.svg"}
              alt=""
              width={40}
              height={40}
            />
          </button>
        </div>

        {/* BURGER MENU */}
        <BurgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user}
          onLogout={() => setIsLogoutOpen(true)}
        />
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutOpen && (
        <ConfirmationModal
          title="Ви впевнені, що хочете вийти?"
          cancelButtonText="Залишитись"
          confirmButtonText="Вийти"
          confirmButtonColor="#8808CC"
          onCancel={() => setIsLogoutOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
    </>
  );
}
