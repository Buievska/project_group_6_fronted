"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import styles from "./BookingToolForm.module.css";

interface BookingToolFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  city: string;
  postOffice: string;
}

const initialValues: BookingToolFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  startDate: "",
  endDate: "",
  city: "",
  postOffice: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Імʼя обовʼязкове"),

  lastName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Прізвище обовʼязкове"),

  phone: Yup.string()
    .required("Номер телефону обовʼязковий")
    .test("is-ua-phone", "Невірний формат телефону", value => {
      if (!value) return false;

      const cleaned = value.replace(/\D/g, "");

      return /^380\d{9}$/.test(cleaned) || /^0\d{9}$/.test(cleaned);
    }),

  startDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : new Date(originalValue)))
    .nullable()
    .required("Оберіть початкову дату"),

  endDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : new Date(originalValue)))
    .nullable()
    .required("Оберіть кінцеву дату")
    .min(Yup.ref("startDate"), "Кінцева дата має бути пізніше початкової"),

  city: Yup.string().trim().required("Місто обовʼязкове"),

  postOffice: Yup.string().trim().required("Відділення обовʼязкове"),
});

export default function BookingToolForm() {
  const fieldId = useId();

  const handleSubmit = (values: BookingToolFormValues, actions: FormikHelpers<BookingToolFormValues>) => {
    console.log("Form submitted:", values);
    actions.resetForm();
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Підтвердження бронювання</h1>

      <Formik<BookingToolFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-firstName`}>
                {"Ім'я"}
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-firstName`}
                name="firstName"
                type="text"
                placeholder="Ваше ім'я"
              />
              <ErrorMessage name="firstName" component="span" className={styles.error} />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-lastName`}>
                Прізвище
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-lastName`}
                name="lastName"
                type="text"
                placeholder="Ваше прізвище"
              />
              <ErrorMessage name="lastName" component="span" className={styles.error} />
            </div>
          </fieldset>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor={`${fieldId}-phone`}>
              Номер телефону
            </label>
            <Field
              className={styles.input}
              id={`${fieldId}-phone`}
              name="phone"
              type="text"
              placeholder="+38 (XXX) XXX XX XX"
            />
            <ErrorMessage name="phone" component="span" className={styles.error} />
          </div>

          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <legend className={styles.label}>Виберіть період бронювання</legend>

            <div className={styles.selectWrapper}>
              <div className={styles.selectInner}>
                <Field as="select" className={styles.select} type="date" name="startDate" id={`${fieldId}-startDate`}>
                  <option value="">Початкова дата</option>
                </Field>
              </div>
              <ErrorMessage name="startDate" component="span" className={styles.error} />
            </div>

            <div className={styles.selectWrapper}>
              <div className={styles.selectInner}>
                <Field as="select" className={styles.select} type="date" name="endDate" id={`${fieldId}-endDate`}>
                  <option value="">Кінцева дата</option>
                </Field>
              </div>
              <ErrorMessage name="endDate" component="span" className={styles.error} />
            </div>
          </fieldset>

          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-city`}>
                Місто доставки
              </label>
              <Field className={styles.input} id={`${fieldId}-city`} name="city" type="text" placeholder="Ваше місто" />
              <ErrorMessage name="city" component="span" className={styles.error} />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-postOffice`}>
                Відділення Нової Пошти
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-postOffice`}
                name="postOffice"
                type="text"
                placeholder="24"
              />
              <ErrorMessage name="postOffice" component="span" className={styles.error} />
            </div>
          </fieldset>

          <div className={styles.formActions}>
            <p className={styles.textPrice}>Ціна: 2100 грн</p>
            <button className={styles.button} type="submit">
              Забронювати
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
}