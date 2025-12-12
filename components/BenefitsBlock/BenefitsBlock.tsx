import css from "./BenefitsBlock.module.css";

const features = [
  {
    icon: "icon-booking",
    title: "Легкий доступ до інструментів",
    text: "Знаходьте потрібний інструмент у своєму районі без зайвих дзвінків і пошуків. Просто введіть назву — і отримайте варіанти поруч із вами.",
  },
  {
    icon: "icon-operation",
    title: "Швидке бронювання",
    text: "Бронюйте інструменти в кілька кліків. Жодних складних форм чи довгих очікувань — тільки простий та зручний процес.",
  },
  {
    icon: "icon-access",
    title: "Зручне управління",
    text: "Додавайте свої інструменти в каталог, редагуйте оголошення та контролюйте оренду. ToolNext допомагає перетворити зайві інструменти на додатковий дохід.",
  },
];

export default function BenefitsBlock() {
  const spritePath = "/sprite.svg";

  return (

    <section className={css.sectionBenefits}>
      <div className={css.content}>
      <h2 className={css.title}>
        ToolNext — платформа для швидкої та зручної оренди інструментів
      </h2>
        <p className={css.description}>
          ToolNext допомагає знайти потрібний інструмент у декілька кліків.
          Користувачі можуть легко орендувати обладнання для ремонту чи хобі, а
          власники — зручно керувати своїми оголошеннями. Ми створили сервіс,
          щоб зробити процес оренди простим, доступним і вигідним для всіх.
        </p>
      </div>

      <div className={css.sectionFeatures}>
        {features.map(({ icon, title, text }) => (
          <div key={title} className={css.item}>
            <svg className={css.icon} aria-hidden="true" focusable="false">
              <use href={`${spritePath}#${icon}`} />
            </svg>
            <div className={css.sectionFeaturesContent}>
              <h3 className={css.sectionFeaturesTitle}>{title}</h3>
              <p className={css.text}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
