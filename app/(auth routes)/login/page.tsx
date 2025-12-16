"use client";
import * as Yup from "yup";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { ApiError } from "@/app/api/api";
import { login, LoginRequset } from "@/lib/api/clientApi";
import css from "./LoginForm.module.css";
import Link from "next/link";
import loginImg from "../../../public/img/loginImage.png";
import Image from "next/image";

const currentYear = new Date().getFullYear();

const SignIn = () => {
  const [error, setError] = useState("");

  // const router = useRouter();
  // const pathname = usePathname();

  const handleSubmit = async (
    values: LoginRequset,
    { setSubmitting }: FormikHelpers<LoginRequset>
  ) => {
    try {
      await login(values);
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "/";
    } catch (error) {
      console.error("Помилка входу:", error);
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Щось пішло не так..."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  return (
    <div className={css.container}>
      <div className={css.leftContent}>
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
            <Link href="/register" className={css.registerLink}>
              Реєстрація
            </Link>
          </div>
          {error && <div className={css.errorMessage}>{error}</div>}
        </div>
        <p className={css.privateConfirm}>© {currentYear} ToolNext</p>
      </div>
      <div className={css.imageSide}>
        <Image src={loginImg} alt="Фото" className={css.loginFoto} />
      </div>
    </div>
  );
};

export default SignIn;
