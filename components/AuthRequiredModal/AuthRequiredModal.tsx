"use client";

import Link from "next/link";
import styles from "./AuthRequiredModal.module.css";

interface Props {
  onClose: () => void;
}

export default function AuthRequiredModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h3 className={styles.title}>Спочатку авторизуйтесь</h3>
        <p className={styles.text}>
          Щоб забрронювати інструмент, треба спочатку зареєструватись, або
          авторизуватись на платформі
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.loginBtn}>
            Вхід
          </Link>
          <Link href="/register" className={styles.registerBtn}>
            Реєстрація
          </Link>
        </div>
      </div>
    </div>
  );
}
