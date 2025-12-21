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
      console.error("Помилка при виході:", error);
    }

    localStorage.removeItem("isLoggedIn");
    logout();

    setIsLogoutOpen(false);
    setIsMenuOpen(false);

    router.push("/");
  };
  return (
    <>
      <header className={styles.header}>
        <div className={styles.containerHeader}>
          {/* LOGO */}
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo.svg" alt="RentTools" width={124} height={20} />
          </Link>

          <div className={styles.headerRight}>
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
                    {user.avatarUrl ? (
                      <Image
                        key={user.avatarUrl}
                        src={
                          user.avatarUrl.includes("?")
                            ? `${user.avatarUrl}&v=${Date.now()}`
                            : `${user.avatarUrl}?v=${Date.now()}`
                        }
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

                  <Image
                    src="/icon-exit.svg"
                    alt=""
                    width={1}
                    height={39}
                    className={styles.userDivider}
                  />

                  <button
                    className={styles.logout}
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
