"use client"

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./Footer.module.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
  <footer className={styles.footer}>
    <div className={styles.container}>
    <div className={styles.top}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/logo.svg"
          alt="ToolNext"
          width={159}
          height={29}
        />
      </Link>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Головна
        </Link>
        <Link href="/tools" className={styles.navLink}>
          Інструменти
        </Link>
        {isAuth ? (
          <>
            <Link href="/profile" className={styles.navLink}>
              Мій профіль
            </Link>
            <Link href="/create" className={styles.navLink}>
              Опублікувати оголошення
            </Link>
          </>
        ) : (
          <>
           <Link href="/login" className={styles.navLink}>
             Увійти
           </Link> 
           <Link href="/register" className={styles.navLink}>
             Зареєструватися
           </Link>
          </>
        )}
      </nav>

      <div className={styles.socials}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Facebook"
        >
          <svg width="32" height="32">
            <use href="/symbol-defs.svg#icon-facebook-1"></use>
          </svg>
        </a>  
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Instagram"
        >
          <svg width="32" height="32">
            <use href="/symbol-defs.svg#icon-instagram-2"></use>
          </svg>
        </a>
      </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {currentYear} ToolNext. Всі права захищені.
        </p>  
      </div>
      </div>
   </footer>
  );
};
