import css from "./BookingToolForm.module.css";

export default function BookingToolForm() {
  return (
    <div className={css.container}>
      <h2 className={css.title}>Підтвердження бронювання</h2>

      <form className={css.form} action="">
        <div className={css.fieldGroup}>
          <label className={css.label}>
            {"Ім'я"}
            <input className={css.input} name="firstName" type="text" placeholder="Ваше ім'я" />
          </label>

          <label className={css.label}>
            Прізвище
            <input className={css.input} name="lastName" type="text" placeholder="Ваше прізвище" />
          </label>
        </div>

        <label className={css.label}>
          Номер телефону
          <input className={css.input} name="phone" type="tel" placeholder="+38 (XXX) XXX XX XX" />
        </label>

        <label className={css.label}>
          Виберіть період бронювання
          <div className={css.fieldGroup}>
            <div className={css.selectWrapper}>
              <select className={css.select} name="startDate">
                <option value="">Початкова дата</option>
              </select>
            </div>
            <div className={css.selectWrapper}>
              <select className={css.select} name="endDate">
                <option value="">Кінцева дата</option>
              </select>
            </div>
          </div>
        </label>

        <div className={css.fieldGroup}>
          <label className={css.label}>
            Місто доставки
            <input className={css.input} type="text" placeholder="Ваше місто" />
          </label>

          <label className={css.label}>
            Відділення Нової Пошти
            <input className={css.input} type="text" placeholder="24" />
          </label>
        </div>

        <div className={css.formActions}>
          <p className={css.textPrice}>Ціна: 2100 грн</p>
          <button className={css.button} type="submit">
            Забронювати
          </button>
        </div>
      </form>
    </div>
  );
}
