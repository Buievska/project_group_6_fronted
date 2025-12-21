"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import styles from "./BookingToolForm.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, getToolById } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { BookingToolFormValues, CreateBookingRequest, CreateBookingResponse } from "@/types/booking";
import toast from "react-hot-toast";
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

const validationSchema = Yup.object({
  firstName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Імʼя обовʼязкове"),
  lastName: Yup.string().trim().min(2, "Мінімум 2 символи").required("Прізвище обовʼязкове"),
  phone: Yup.string()
    .required("Номер телефону обовʼязковий")
    .matches(/^\+380\d{9}$/, "Номер телефону має бути у форматі +380XXXXXXXXX"),
  dateRange: Yup.object({
    from: Yup.date().nullable().required("Оберіть дату початку"),
    to: Yup.date().nullable().required("Оберіть дату завершення"),
  }).test("dates-required", "Оберіть період бронювання", value => value?.from !== null && value?.to !== null),
  deliveryCity: Yup.string().trim().required("Місто обовʼязкове"),
  deliveryBranch: Yup.string().trim().required("Відділення обовʼязкове"),
});

export default function BookingToolForm({ toolId }: BookingToolFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery<Tool>({
    queryKey: ["tool", toolId],
    queryFn: () => getToolById(toolId),
    enabled: Boolean(toolId),
  });

  const { mutate, isPending } = useMutation<CreateBookingResponse, Error, CreateBookingRequest>({
    mutationFn: createBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tool", toolId] });

      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });

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
      phone: values.phone,
      startDate: values.dateRange.from.toISOString().split("T")[0],
      endDate: values.dateRange.to.toISOString().split("T")[0],
      deliveryCity: values.deliveryCity,
      deliveryBranch: values.deliveryBranch,
    };

    mutate(payload, {
      onError: () => actions.setSubmitting(false),
    });
  };

  if (isLoading) {
    return <p>Завантаження інструмента...</p>;
  }

  if (error || !tool) {
    return <p>Інструмент не знайдено</p>;
  }

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

          <CalendarField
            bookedRanges={tool.bookedDates.map((d: { from: string; to: string }) => ({
              from: new Date(d.from),
              to: new Date(d.to),
            }))}
          />

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
            <PriceBlock pricePerDay={tool.pricePerDay} />
            <button className={styles.button} type="submit" disabled={isPending}>
              {isPending ? "Завантаження..." : "Забронювати"}
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
}
