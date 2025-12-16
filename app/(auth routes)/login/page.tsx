"use client";
import * as Yup from "yup";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ApiError } from "@/app/api/api";
import { login, LoginRequset } from "@/lib/api/clientApi";
import css from "./LoginForm.module.css";
import Link from "next/link";
import loginImg from "../../public/loginImage.png";
import Image from "next/image";

const SignIn = () => {
  const [error, setError] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (values: LoginRequset, setSubmitting) => {
    try {
      const response = await login(values);

      if (response) {
        router.push(pathname || "/");
      } else {
        setError("Неправильна електронна адреса або пароль");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Ой... тут якась помилка"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Недійсна електронна адреса")
      .required("Необхідно вказати адресу електронної пошти"),
    password: Yup.string().required("Необхідно ввести пароль"),
  });
  return (
    <div className={css.container}>
      <Link href="/" className={css.logoLogin}>
        <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
      </Link>
      <div className={css.containerLogin}>
        <h1 className={css.loginTitle}>Вхід</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={css.loginForm}>
              <label htmlFor="email-login" className={css.loginLabel}>
                Пошта*
                <Field
                  className={`${css.loginField} ${
                    errors.email && touched.email ? css.inputError : ""
                  }`}
                  name="email"
                  id="email-login"
                  type="email"
                  placeholder="Ваша пошта"
                />
              </label>
              <ErrorMessage
                name="email"
                component="span"
                className={css.errorMessage}
              />

              <label htmlFor="password-login" className={css.loginLabel}>
                Пароль*
                <Field
                  className={`${css.loginField} ${
                    errors.password && touched.password ? css.inputError : ""
                  }`}
                  name="password"
                  id="password-login"
                  type="password"
                  placeholder="*******"
                />
              </label>
              <ErrorMessage
                name="password"
                component="span"
                className={css.errorMessage}
              />

              <button
                type="submit"
                className={css.btnLogin}
                disabled={isSubmitting}
              >
                Увійти
              </button>
            </Form>
          )}
        </Formik>

        <div className={css.registerQuestion}>
          <p>Не маєте аккаунту?</p>
          <Link href="/sign-up" className={css.registerLink}>
            Реєстрація
          </Link>
        </div>
        {error && <div className={css.errorMessage}>{error}</div>}
      </div>
      <div>
        <Image src={loginImg} alt="Фото" className={css.loginFoto} />
      </div>
      <p className={css.privateConfirm}>© 2025 ToolNext</p>
    </div>
  );
};

export default SignIn;
