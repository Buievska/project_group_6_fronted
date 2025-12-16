"use client";
import * as Yup from "yup";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { login, LoginRequset } from "@/lib/api/clientApi";
import css from "./LoginForm.module.css";
import Link from "next/link";
import loginImg from "../../../public/img/loginImage.png";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const currentYear = new Date().getFullYear();

const SignIn = () => {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    values: LoginRequset,
    { setSubmitting }: FormikHelpers<LoginRequset>
  ) => {
    setServerError("");

    try {
      await login(values);
      localStorage.setItem("isLoggedIn", "true");

      router.push("/");
    } catch (error) {
      console.error("Помилка входу:", error);
      let errorMsg = "Щось пішло не так...";

      // Обробка помилки як у реєстрації
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      setServerError(errorMsg);
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
      {/* ЛІВА ЧАСТИНА */}
      <div className={css.leftContent}>
        <div className={css.navbar}>
          <Link href="/" className={css.logoLogin}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>
        </div>

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

                {/* 👇 ВИВЕДЕННЯ ПОМИЛКИ СЕРВЕРА */}
                {serverError && (
                  <div
                    className={css.errorMessage}
                    style={{ textAlign: "center", marginTop: "10px" }}
                  >
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  className={css.btnLogin}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Вхід..." : "Увійти"}
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
        </div>

        <p className={css.privateConfirm}>© {currentYear} ToolNext</p>
      </div>

      {/* ПРАВА ЧАСТИНА */}
      <div className={css.imageSide}>
        <Image src={loginImg} alt="Фото" className={css.loginFoto} priority />
      </div>
    </div>
  );
};

export default SignIn;
