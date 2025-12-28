"use client";

import { useId, useMemo } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import styles from "./BookingToolForm.module.css";
import { createBooking, getToolById } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore"; // Переконайтеся, що імпорт вірний
import {
  BookingToolFormValues,
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/types/booking";
import { Tool } from "@/types/tool";
import CalendarField from "../BookingCalendar/CalendarField";
import PriceBlock from "./PriceBlock";

interface BookingToolFormProps {
  toolId: string;
}

const initialValues: BookingToolFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  dateRange: { from: null, to: null },
  deliveryCity: "",
  deliveryBranch: "",
};

// Допоміжні функції залишаємо зовні
const getPureDateValue = (d: Date | string | null) => {
  if (!d) return 0;
  const date = new Date(d);
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingToolForm({ toolId }: BookingToolFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. Отримуємо поточного юзера всередині компонента
  const { user } = useAuthStore();

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery<Tool>({
    queryKey: ["tool", toolId],
    queryFn: () => getToolById(toolId),
    enabled: Boolean(toolId),
  });

  // 2. Оновлюємо схему валідації
  const validationSchema = useMemo(() => {
    return Yup.object({
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
        .matches(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
      dateRange: Yup.object({
        from: Yup.date().nullable().required("Оберіть дату початку"),
        to: Yup.date().nullable().required("Оберіть дату завершення"),
      }).test(
        "no-overlaps",
        "Ви вже орендували цей інструмент на ці дати. Оберіть інший період.",
        (value) => {
          // Якщо немає дат або даних про інструмент/юзера — пропускаємо
          if (!value?.from || !value?.to || !tool?.bookedDates || !user)
            return true;

          const selectedStart = getPureDateValue(value.from);
          const selectedEnd = getPureDateValue(value.to);

          const hasOverlap = tool.bookedDates.some((booked) => {
            // ПЕРЕВІРКА: чи це бронювання належить поточному юзеру
            // Порівнюємо ID як рядки для безпеки
            const isMine = String(booked.userId) === String(user._id);
            if (!isMine) return false;

            const bookedStart = getPureDateValue(booked.from);
            const bookedEnd = getPureDateValue(booked.to);

            return selectedStart <= bookedEnd && selectedEnd >= bookedStart;
          });

          return !hasOverlap;
        }
      ),
      deliveryCity: Yup.string().trim().required("Місто обовʼязкове"),
      deliveryBranch: Yup.string().trim().required("Відділення обовʼязкове"),
    });
  }, [tool, user]); // Додаємо user в залежності

  const { mutate, isPending } = useMutation<
    CreateBookingResponse,
    Error,
    CreateBookingRequest
  >({
    mutationFn: createBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      router.push("/confirm/booking");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Сталася помилка";
      toast.error(msg);
    },
  });

  const handleSubmit = (
    values: BookingToolFormValues,
    actions: FormikHelpers<BookingToolFormValues>
  ) => {
    if (!values.dateRange.from || !values.dateRange.to) return;

    mutate(
      {
        toolId,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        startDate: formatLocalDate(values.dateRange.from),
        endDate: formatLocalDate(values.dateRange.to),
        deliveryCity: values.deliveryCity,
        deliveryBranch: values.deliveryBranch,
      },
      {
        onSettled: () => actions.setSubmitting(false),
      }
    );
  };

  if (isLoading) return <div className={styles.loading}>Завантаження...</div>;
  if (error || !tool)
    return <div className={styles.error}>Інструмент не знайдено</div>;

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Підтвердження бронювання</h1>

      <Formik<BookingToolFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form className={styles.form}>
          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Ім'я</label>
              <Field className={styles.input} name="firstName" />
              <ErrorMessage
                name="firstName"
                component="span"
                className={styles.errorText}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Прізвище</label>
              <Field className={styles.input} name="lastName" />
              <ErrorMessage
                name="lastName"
                component="span"
                className={styles.errorText}
              />
            </div>
          </fieldset>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Телефон</label>
            <Field
              className={styles.input}
              name="phone"
              placeholder="+380XXXXXXXXX"
            />
            <ErrorMessage
              name="phone"
              component="span"
              className={styles.errorText}
            />
          </div>

          <div className={styles.calendarBox}>
            <CalendarField
              bookedRanges={tool.bookedDates

                .filter((d) => String(d.userId) === String(user?._id))
                .map((d) => ({
                  from: new Date(d.from),
                  to: new Date(d.to),
                }))}
            />
            <ErrorMessage name="dateRange">
              {(msg) => {
                const errorDisplay =
                  typeof msg === "string"
                    ? msg
                    : Object.values(msg as object)[0];
                return errorDisplay ? (
                  <span className={styles.errorText}>
                    {String(errorDisplay)}
                  </span>
                ) : null;
              }}
            </ErrorMessage>
          </div>

          <fieldset className={`${styles.fieldGroup} ${styles.fieldsetReset}`}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Місто</label>
              <Field className={styles.input} name="deliveryCity" />
              <ErrorMessage
                name="deliveryCity"
                component="span"
                className={styles.errorText}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Відділення НП</label>
              <Field className={styles.input} name="deliveryBranch" />
              <ErrorMessage
                name="deliveryBranch"
                component="span"
                className={styles.errorText}
              />
            </div>
          </fieldset>

          <div className={styles.formActions}>
            <PriceBlock pricePerDay={tool.pricePerDay} />
            <button
              className={styles.button}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Бронювання..." : "Забронювати"}
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
}
