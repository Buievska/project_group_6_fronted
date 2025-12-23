"use client";

import Link from "next/link";
import Image from "next/image";
import css from "./RegistrationBlock.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export const RegistrationBlock = () => {
  const { user } = useAuthStore();

  return (
    <section className={css.container}>
      <div className={css.content}>
        <h2 className={css.registrationBlockTitle}>
          {user
            ? `Раді бачити вас, ${user.name || "друже"}!`
            : "Зареєструйтесь і отримайте доступ до інструментів поруч із вами"}
        </h2>

        <p className={css.registrationBlockSubtitle}>
          {user ? (
            // Текст для залогіненого юзера
            <>
              Маєте інструмент, що лежить без діла? Здайте його в оренду та
              заробляйте!
              <br />
              Або знайдіть те, що потрібно для роботи, прямо зараз.
            </>
          ) : (
            // Текст для гостя
            <>
              Не витрачайте гроші на купівлю — орендуйте зручно та швидко.
              <br />
              Приєднуйтесь до ToolNext вже сьогодні!
            </>
          )}
        </p>

        {user ? (
          <Link href="/profile" className={css.btnPrimary}>
            Мій профіль
          </Link>
        ) : (
          <Link href="/register" className={css.btnPrimary}>
            Зареєструватися
          </Link>
        )}
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
