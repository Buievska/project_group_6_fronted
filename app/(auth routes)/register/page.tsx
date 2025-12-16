"use client";

import styles from "./Register.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";
import axios from "axios";
import Image from "next/image";
import registerImage from "../../../public/img/registerImage.jpg";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string>("");
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setError("");

    try {
      const user: User = await register({
        name: values.username,
        email: values.email,
        password: values.password,
      });

      // авторизація після реєстрації
      login(user);

      // редірект на попередню сторінку або на головну
      const redirectTo = searchParams.get("from") || "/";
      router.push(redirectTo);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Помилка реєстрації");
      } else {
        setError("Невідома помилка. Спробуйте ще раз.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.formSide}>
        <div className={styles.navbar}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo.svg" alt="RentTools" width={124} height={20} />
          </Link>
        </div>

        <div className={styles.formContent}>
          <h2 className={styles.registerTitle}>Реєстрація</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={styles.registrationForm} noValidate>
                <label className={styles.label} htmlFor={`${fieldId}-username`}>
                  Імʼя*
                </label>
                <Field
                  className={styles.inputField}
                  name="username"
                  id={`${fieldId}-username`}
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor={`${fieldId}-email`}>
                  Пошта*
                </label>
                <Field
                  className={styles.inputField}
                  name="email"
                  type="email"
                  id={`${fieldId}-email`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className={styles.error}
                />

                <label className={styles.label} htmlFor={`${fieldId}-password`}>
                  Пароль*
                </label>
                <Field
                  className={styles.inputField}
                  name="password"
                  type="password"
                  id={`${fieldId}-password`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className={styles.error}
                />

                <label
                  className={styles.label}
                  htmlFor={`${fieldId}-confirmPassword`}
                >
                  Підтвердіть пароль*
                </label>
                <Field
                  className={styles.inputField}
                  name="confirmPassword"
                  type="password"
                  id={`${fieldId}-confirmPassword`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className={styles.error}
                />

                {error && <p className={styles.serverError}>{error}</p>}

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
      <div className={styles.imageSide}>
        <Image
          src={registerImage}
          alt="Registration illustration"
          className={styles.registerImage}
        />
      </div>
    </div>
  );
}
