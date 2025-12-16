"use client";
import axios from "axios";
import styles from "./Register.module.css";
import { useSearchParams } from "next/navigation";
import { useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";
import Image from "next/image";
import registerImage from "../../../public/img/registerImage.jpg";
import { toast } from "react-toastify";

/* ================= TYPES ================= */

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ================= CONSTANTS ================= */

const currentYear = new Date().getFullYear();

const initialValues: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  username: Yup.string()
    .min(2, "Мінімум 2 символи")
    .required("Обовʼязкове поле"),
  email: Yup.string().email("Некоректна пошта").required("Обовʼязкове поле"),
  password: Yup.string()
    .min(6, "Мінімум 6 символів")
    .required("Обовʼязкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі не співпадають")
    .required("Обовʼязкове поле"),
});

/* ================= PAGE ================= */

export default function RegisterPage() {
  const fieldId = useId();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const user: User = await register({
        name: values.username,
        email: values.email,
        password: values.password,
      });

      login(user);
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Реєстрація успішна! Ласкаво просимо.");

      const redirectTo = searchParams.get("from") || "/";

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch (err: unknown) {
      console.error("Помилка реєстрації:", err);
      let errorMsg = "Помилка реєстрації. Спробуйте ще раз.";

      if (axios.isAxiosError(err)) {
        errorMsg =
          err.response?.data?.message || err.response?.data?.error || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      {/* ЛІВА ЧАСТИНА (Форма) */}
      <div className={styles.formSide}>
        <div className={styles.navbar}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/Logo.svg" alt="RentTools" width={124} height={20} />
          </Link>
        </div>

        <div className={styles.formContent}>
          <h2 className={styles.registerTitle}>Реєстрація</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form
                className={styles.registrationForm}
                noValidate
                autoComplete="off"
              >
                {/* Ім'я */}
                <label className={styles.label} htmlFor={`${fieldId}-username`}>
                  Імʼя*
                </label>
                <Field
                  className={`${styles.inputField} ${
                    errors.username && touched.username ? styles.inputError : ""
                  }`}
                  name="username"
                  id={`${fieldId}-username`}
                  placeholder="Ваше ім'я"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className={styles.error}
                />

                {/* Пошта */}
                <label className={styles.label} htmlFor={`${fieldId}-email`}>
                  Пошта*
                </label>
                <Field
                  className={`${styles.inputField} ${
                    errors.email && touched.email ? styles.inputError : ""
                  }`}
                  name="email"
                  type="email"
                  id={`${fieldId}-email`}
                  placeholder="Ваша пошта"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className={styles.error}
                />

                {/* Пароль */}
                <label className={styles.label} htmlFor={`${fieldId}-password`}>
                  Пароль*
                </label>
                <Field
                  className={`${styles.inputField} ${
                    errors.password && touched.password ? styles.inputError : ""
                  }`}
                  name="password"
                  type="password"
                  id={`${fieldId}-password`}
                  placeholder="*******"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className={styles.error}
                />

                {/* Підтвердження паролю */}
                <label
                  className={styles.label}
                  htmlFor={`${fieldId}-confirmPassword`}
                >
                  Підтвердіть пароль*
                </label>
                <Field
                  className={`${styles.inputField} ${
                    errors.confirmPassword && touched.confirmPassword
                      ? styles.inputError
                      : ""
                  }`}
                  name="confirmPassword"
                  type="password"
                  id={`${fieldId}-confirmPassword`}
                  placeholder="*******"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className={styles.error}
                />

                <button
                  className={styles.registrationBtn}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Реєстрація..." : "Зареєструватись"}
                </button>

                <p className={styles.text}>
                  Вже маєте акаунт?{" "}
                  <Link href="/login" className={styles.loginLink}>
                    Вхід
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        <p className={styles.footerText}>© {currentYear} ToolNext</p>
      </div>

      {/* ПРАВА ЧАСТИНА (Картинка) */}
      <div className={styles.imageSide}>
        <Image
          src={registerImage}
          alt="Registration illustration"
          className={styles.registerImage}
          priority
        />
      </div>
    </div>
  );
}
