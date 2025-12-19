// components/BookingToolForm/BookingToolForm.tsx
"use client";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
  FormikErrors,
} from "formik";
import * as Yup from "yup";
import { useId } from "react";
import BookingCalendar from "../BookingCalendar/BookingCalendar";
import styles from "./BookingToolForm.module.css";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface BookingToolFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  dateRange: DateRange;
  city: string;
  postOffice: string;
}

const initialValues: BookingToolFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  dateRange: { from: null, to: null },
  city: "",
  postOffice: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "Мінімум 2 символи")
    .required("Імʼя обовʼязкове"),

  lastName: Yup.string()
    .trim()
    .min(2, "Мінімум 2 символи")
    .required("Прізвище обовʼязкове"),

  phone: Yup.string()
    .required("Номер телефону обовʼязковий")
    .test("is-ua-phone", "Невірний формат телефону", (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\D/g, "");
      return /^380\d{9}$/.test(cleaned) || /^0\d{9}$/.test(cleaned);
    }),

  dateRange: Yup.object({
    from: Yup.date().nullable().required("Оберіть дату початку"),
    to: Yup.date().nullable().required("Оберіть дату завершення"),
  }).test(
    "dates-required",
    "Оберіть період бронювання",
    (value) => value?.from !== null && value?.to !== null
  ),

  city: Yup.string().trim().required("Місто обовʼязкове"),

  postOffice: Yup.string().trim().required("Відділення обовʼязкове"),
});

// Компонент-обгортка для календаря з Formik
function CalendarField() {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<BookingToolFormValues>();

  const bookedDates = [
    new Date(2025, 7, 12),
    new Date(2025, 7, 15),
  ];

  const handleChange = (range: DateRange) => {
    setFieldValue("dateRange", range, true);
  };

  const getErrorMessage = (): string | undefined => {
    if (!touched.dateRange || !errors.dateRange) {
      return undefined;
    }

    if (typeof errors.dateRange === "string") {
      return errors.dateRange;
    }

    const nestedErrors = errors.dateRange as FormikErrors<DateRange>;
    return nestedErrors.from || nestedErrors.to || undefined;
  };

  return (
    <div className={styles.calendarWrapper}>
      <label className={styles.label}>Виберіть період бронювання</label>
      <BookingCalendar
        bookedDates={bookedDates}
        value={values.dateRange}
        onChange={handleChange}
        error={getErrorMessage()}
      />
    </div>
  );
}

export default function BookingToolForm() {
  const fieldId = useId();

  const handleSubmit = (
    values: BookingToolFormValues,
    actions: FormikHelpers<BookingToolFormValues>
  ) => {
    const submitData = {
      ...values,
      startDate: values.dateRange.from?.toISOString(),
      endDate: values.dateRange.to?.toISOString(),
    };

    console.log("Form submitted:", submitData);
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
          {/* ... решта полів залишається без змін ... */}
          
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
              <ErrorMessage
                name="firstName"
                component="span"
                className={styles.error}
              />
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
              <ErrorMessage
                name="lastName"
                component="span"
                className={styles.error}
              />
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
            <ErrorMessage
              name="phone"
              component="span"
              className={styles.error}
            />
          </div>

          {/* Календар */}
          <CalendarField />

          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-city`}>
                Місто доставки
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-city`}
                name="city"
                type="text"
                placeholder="Ваше місто"
              />
              <ErrorMessage
                name="city"
                component="span"
                className={styles.error}
              />
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
              <ErrorMessage
                name="postOffice"
                component="span"
                className={styles.error}
              />
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