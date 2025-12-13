import styles from "./HeroBlock.module.css";

export const HeroBlock = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1>Знайди інструмент</h1>
        {/* Тут буде логіка пошуку (input + button) */}
        <div className={styles.searchBox}>[Пошуковий рядок]</div>
      </div>
    </section>
  );
};
