"use client";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { ApiError } from "@/app/api/api";
import { login, LoginRequset } from "@/lib/api/clientApi";
import css from "./LoginForm.module.css";
import Link from "next/link";
import loginImg from "../../../public/img/loginImage.png"; // Перевірте шлях
import Image from "next/image";
import { toast } from "react-toastify";

const currentYear = new Date().getFullYear();

const SignIn = () => {
  // const [error, setError] = useState(""); // <-- Можна прибрати, якщо використовуємо тільки тости

  const handleSubmit = async (
    values: LoginRequset,
    { setSubmitting }: FormikHelpers<LoginRequset>
  ) => {
    try {
      await login(values);

      // 1. Ставимо прапорець
      localStorage.setItem("isLoggedIn", "true");

      // 2. Показуємо успішне повідомлення
      toast.success("Вхід успішний! Перенаправлення...");

      // 3. Робимо паузу 1 сек, щоб юзер побачив повідомлення, і тоді перезавантажуємо
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Помилка входу:", error);

      const errorMsg =
        (error as ApiError).response?.data?.error ??
        (error as ApiError).message ??
        "Щось пішло не так...";

      // 4. Показуємо помилку через тост
      toast.error(errorMsg);

      // setError(errorMsg); // Якщо хочете дублювати текст під формою - розкоментуйте
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
          {/* {error && <div className={css.errorMessage}>{error}</div>} */}
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
