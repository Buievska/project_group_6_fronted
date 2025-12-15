'use client';

import css from './Register.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';
import axios from 'axios';
import Image from 'next/image';

/* ================= TYPES ================= */

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ================= CONSTANTS ================= */

const initialValues: RegisterFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object({
  username: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .required("Обовʼязкове поле"),
  email: Yup.string()
    .email('Некоректна пошта')
    .required("Обовʼязкове поле"),
  password: Yup.string()
    .min(6, 'Мінімум 6 символів')
    .required("Обовʼязкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі не співпадають')
    .required("Обовʼязкове поле"),
});

/* ================= PAGE ================= */

export default function RegisterPage() {
  const fieldId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string>('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setError('');

    try {
      const user: User = await register({
        name: values.username,
        email: values.email,
        password: values.password,
      });

      // авторизація після реєстрації 
      login(user);

      // редірект на попередню сторінку або на головну
      const redirectTo = searchParams.get('from') || '/';
      router.push(redirectTo);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Помилка реєстрації');
      } else {
        setError('Невідома помилка. Спробуйте ще раз.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.registerPage}>
      <div className={css.leftSide}>
        <div className={css.navbar}>svg</div>
        <div className={css.content}>
            <h2 className={css.registerTitle}>Реєстрація</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <label htmlFor={`${fieldId}-username`}>Імʼя*</label>
                    <Field name="username" id={`${fieldId}-username`} />
                    <ErrorMessage name="username" component="p" className={css.error} />

                    <label htmlFor={`${fieldId}-email`}>Пошта*</label>
                    <Field name="email" type="email" id={`${fieldId}-email`} />
                    <ErrorMessage name="email" component="p" className={css.error} />

                    <label htmlFor={`${fieldId}-password`}>Пароль*</label>
                    <Field name="password" type="password" id={`${fieldId}-password`} />
                    <ErrorMessage name="password" component="p" className={css.error} />

                    <label htmlFor={`${fieldId}-confirmPassword`}>Підтвердіть пароль*</label>
                    <Field name="confirmPassword" type="password" id={`${fieldId}-confirmPassword`} />
                    <ErrorMessage name="confirmPassword" component="p" className={css.error} />

                    {error && <p className={css.serverError}>{error}</p>}

                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Реєстрація...' : 'Зареєструватись'}
                    </button>
                  </Form>
               )}
            </Formik>

            <p>Вже маєте акаунт?{' '}
              <a href="/(auth routes)/login">Вхід</a>
            </p>
        </div>
        <div className={css.footer}>
          <p>© 2025 ToolNext</p>
        </div>
      </div>
      <div className={css.rightSide}>
          <Image
            src="/images/register-placeholder.jpg" // заміни на свій шлях
            alt="Registration illustration"
            className={css.image}
          />
      </div>
    </div>
  );
}
