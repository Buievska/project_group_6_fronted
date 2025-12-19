"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import BurgerMenu from "./BurgerMenu";
import { useAuthStore } from "@/lib/store/authStore";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { logoutRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  const handleConfirmLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Серверна сесія вже неактивна, виконуємо локальний вихід.");
    } finally {
      localStorage.removeItem("isLoggedIn");
      logout();

      setIsLogoutOpen(false);
      setIsMenuOpen(false);

      router.push("/");
      router.refresh();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.containerHeader}>
          {/* LOGO */}
          <Link href="/" className={styles.logoLink}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>

          {/* === DESKTOP PART (ПК) === */}

          <div className={styles.desktopContainer}>
            {!user ? (
              <>
                <nav className={styles.navLinks}>
                  <Link href="/">Головна</Link>
                  <Link href="/tools">Інструменти</Link>
                  <Link href="/login">Увійти</Link>
                </nav>
                <Link href="/register" className={styles.registerBtn}>
                  Зареєструватися
                </Link>
              </>
            ) : (
              <>
                <nav className={styles.navLinks}>
                  <Link href="/">Головна</Link>
                  <Link href="/tools">Інструменти</Link>
                  <Link href="/profile">Мій профіль</Link>
                </nav>

                <div className={styles.userActions}>
                  <Link href="/tools/new" className={styles.publishBtn}>
                    Опублікувати оголошення
                  </Link>

                  <div className={styles.userInfo}>
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.userInitial}>
                        {(user.name?.charAt(0) || "U").toUpperCase()}
                      </div>
                    )}
                    <span className={styles.userName}>
                      {user.name || "Користувач"}
                    </span>
                  </div>

                  <div className={styles.divider}></div>

                  <button
                    className={styles.logoutBtn}
                    onClick={() => setIsLogoutOpen(true)}
                    aria-label="Вийти"
                  >
                    <Image
                      src="/button-exit.svg"
                      alt="Вихід"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            className={styles.burger}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            <Image
              src={isMenuOpen ? "/burger-close.svg" : "/burger-open.svg"}
              alt=""
              width={40}
              height={40}
            />
          </button>
        </div>

        <BurgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user}
          onLogout={() => setIsLogoutOpen(true)}
        />
      </header>

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
