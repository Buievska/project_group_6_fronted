import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
}
