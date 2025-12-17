import styles from "./Confirm.module.css";

export default function BookingConfirmationPage() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Інструмент успішно заброньовано</h1>
      <p className={styles.text}>Власник інструменту скоро з вами звʼяжеться стосовно деталей та оплати вашої броні</p>
      <button className={styles.button} type="button">
        На головну
      </button>
    </section>
  );
}
