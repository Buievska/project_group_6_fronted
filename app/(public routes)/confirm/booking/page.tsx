import Link from "next/link";
import styles from "./BookingConfirmation.module.css";

export default function BookingConfirmationPage() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Інструмент успішно заброньовано</h1>
      <p className={styles.text}>
        Власник інструменту скоро з вами звʼяжеться стосовно деталей та оплати
        вашої броні
      </p>
      <Link href={"/"} className={styles.link}>
        На головну
      </Link>
    </section>
  );
}
