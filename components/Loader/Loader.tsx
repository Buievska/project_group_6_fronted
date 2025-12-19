"use client";

import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.backdrop}>
      <div className={styles.spinner} />
    </div>
  );
}

