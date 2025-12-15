import Link from "next/link";
import Image from 'next/image';
import css from "./RegistrationBlock.module.css"


export const RegistrationBlock = () => {
  return (
    <section className={css.container}>
      <div className={css.content}>
        <h2 className={css.registrationBlockTitle}>Зареєструйтесь і отримайте доступ до інструментів поруч із вами</h2>
        <p className={css.registrationBlockSubtitle}>Не витрачайте гроші на купівлю — орендуйте зручно та швидко.<br />
        Приєднуйтесь до ToolNext вже сьогодні!</p>
        <Link href="/auth/register" className={css.btnPrimary}>
          Зареєструватися
        </Link>
      </div>
      <Image
        className={css.registrationBlockImage}
        src="/img/imgRegBlock.png"
        alt="Tools"
        width={335}
        height={223}
      />
    </section>
  );
};