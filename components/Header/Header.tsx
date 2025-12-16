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

    // Очищення даних
    localStorage.removeItem("isLoggedIn");
    logout();

    // Закриття меню та модалок
    setIsLogoutOpen(false);
    setIsMenuOpen(false);

    // Видалено toast.success(...)

    // Редірект на головну
    router.push("/");
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
            {/* ВАРІАНТ 1: ГІСТЬ (НЕ ЗАЛОГОВАНИЙ) */}
            {!user ? (
              <>
                <nav className={styles.navLinks}>
                  <Link href="/">Головна</Link>
                  <Link href="/tools">Інструменти</Link>
                  <Link href="/login">Увійти</Link> {/* Увійти як посилання */}
                </nav>
                <Link href="/register" className={styles.registerBtn}>
                  Зареєструватися
                </Link>
              </>
            ) : (
              /* ВАРІАНТ 2: КОРИСТУВАЧ (ЗАЛОГОВАНИЙ) */
              <>
                <nav className={styles.navLinks}>
                  <Link href="/">Головна</Link>
                  <Link href="/tools">Інструменти</Link>
                  <Link href="/profile">Мій профіль</Link>
                </nav>

                <div className={styles.userActions}>
                  {/* Кнопка Опублікувати */}
                  <Link href="/create" className={styles.publishBtn}>
                    Опублікувати оголошення
                  </Link>

                  {/* Аватар та Ім'я */}
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

                  {/* Розділювач */}
                  <div className={styles.divider}></div>

                  {/* Кнопка Вийти */}
                  <button
                    className={styles.logoutBtn}
                    onClick={() => setIsLogoutOpen(true)}
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

          {/* BURGER BUTTON (Тільки мобілка) */}
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

        {/* Мобільне меню */}
        <BurgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user}
          onLogout={() => setIsLogoutOpen(true)}
        />
      </header>

      {/* Модалка виходу */}
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
