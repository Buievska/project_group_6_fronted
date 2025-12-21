"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./Footer.module.css";

export const socials = [
  {
    name: "Facebook",
    icon: "icon-facebook",
    url: "https://facebook.com",
  },
  {
    name: "Instagram",
    icon: "icon-instagram",
    url: "https://instagram.com",
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isAuth = useAuthStore((state) => state.isAuth);

  const spritePath = "/sprite.svg";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.svg" alt="ToolNext" width={159} height={29} />
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
                <Link href="/tools/new" className={styles.publishBtn}>
                  Опублікувати оголошення
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.navLink}>
                  Увійти
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  Зареєструватися
                </Link>
              </>
            )}
          </nav>

          <div className={styles.socials}>
            {socials.map(({ name, icon, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={name}
              >
                <svg
                  className={styles.socialIcon}
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href={`${spritePath}#${icon}`} />
                </svg>
              </a>
            ))}
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
