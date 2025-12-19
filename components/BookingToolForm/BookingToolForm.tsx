"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers, useFormikContext, FormikErrors } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import BookingCalendar from "../BookingCalendar/BookingCalendar";
import styles from "./BookingToolForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";
import toast from "react-hot-toast";

// props для форми
interface BookingToolFormProps {
  toolId: string; // передаємо _id інструменту
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface BookingToolFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  dateRange: DateRange;
  deliveryCity: string;
  deliveryBranch: string;
}

const initialValues: BookingToolFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  dateRange: { from: null, to: null },
  deliveryCity: "",
  deliveryBranch: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Імʼя обовʼязкове"),
  lastName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Прізвище обовʼязкове"),

  phone: Yup.string()
    .required("Номер телефону обовʼязковий")
    .transform(value => {
      if (!value) return value;
      const digits = value.replace(/\D/g, "");
      if (digits.startsWith("380")) return `+${digits}`;
      if (digits.startsWith("0")) return `+38${digits}`;
      return value;
    })
    .matches(/^\+380\d{9}$/, "Невірний формат телефону"),

  dateRange: Yup.object({
    from: Yup.date().nullable().required("Оберіть дату початку"),
    to: Yup.date().nullable().required("Оберіть дату завершення"),
  }).test("dates-required", "Оберіть період бронювання", value => value?.from !== null && value?.to !== null),

  deliveryCity: Yup.string().trim().required("Місто обовʼязкове"),
  deliveryBranch: Yup.string().trim().required("Відділення обовʼязкове"),
});

// Компонент-обгортка для календаря з Formik
function CalendarField() {
  const { values, setFieldValue, errors, touched } = useFormikContext<BookingToolFormValues>();

  const bookedDates = [new Date(2025, 7, 12), new Date(2025, 7, 15)];

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

// Задаємо ціну за день (пізніше буде із БД)
const PRICE_PER_DAY = 700;

// Хук для розрахунку кількості днів
function calculateDays(from: Date | null, to: Date | null): number {
  if (!from || !to) return 0;

  const start = new Date(from);
  const end = new Date(to);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

// Компонент для відображення ціни (через Formik)
function PriceBlock() {
  const { values } = useFormikContext<BookingToolFormValues>();

  const days = calculateDays(values.dateRange.from, values.dateRange.to);

  const totalPrice = days * PRICE_PER_DAY;

  return (
    <p className={styles.textPrice}>{days > 0 ? `Ціна: ${totalPrice} грн` : "Оберіть період для розрахунку ціни"}</p>
  );
}

export default function BookingToolForm({ toolId }: BookingToolFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation<CreateBookingResponse, Error, CreateBookingRequest>({
    mutationFn: createBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["booking"] });
      router.push("/confirm/booking");
    },
    onError: error => {
      toast.error(error.message || "Помилка створення бронювання");
    },
  });

  const handleSubmit = (values: BookingToolFormValues, actions: FormikHelpers<BookingToolFormValues>) => {
    if (!values.dateRange.from || !values.dateRange.to) return;

    const payload: CreateBookingRequest = {
      toolId,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone, // +380XXXXXXXXX
      startDate: values.dateRange.from.toISOString().split("T")[0], // конвертація у YYYY-MM-DD
      endDate: values.dateRange.to.toISOString().split("T")[0],
      deliveryCity: values.deliveryCity,
      deliveryBranch: values.deliveryBranch,
    };

    mutate(payload, {
      onError: () => actions.setSubmitting(false),
    });
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

          {/* Календар */}
          <CalendarField />

          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-deliveryCity`}>
                Місто доставки
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-deliveryCity`}
                name="deliveryCity"
                type="text"
                placeholder="Ваше місто"
              />
              <ErrorMessage name="deliveryCity" component="span" className={styles.error} />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor={`${fieldId}-deliveryBranch`}>
                Відділення Нової Пошти
              </label>
              <Field
                className={styles.input}
                id={`${fieldId}-deliveryBranch`}
                name="deliveryBranch"
                type="text"
                placeholder="24"
              />
              <ErrorMessage name="deliveryBranch" component="span" className={styles.error} />
            </div>
          </fieldset>

          <div className={styles.formActions}>
            <PriceBlock />
            <button className={styles.button} type="submit" disabled={isPending}>
              {isPending ? "Завантаження..." : "Забронювати"}
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
}
