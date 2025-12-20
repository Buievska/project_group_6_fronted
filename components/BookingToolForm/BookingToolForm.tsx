"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers, useFormikContext, FormikErrors } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import BookingCalendar, { BookedRange, DateRange } from "../BookingCalendar/BookingCalendar";
import styles from "./BookingToolForm.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, getToolById } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";
import toast from "react-hot-toast";
import { Tool } from "@/types/tool";

interface BookingToolFormProps {
  toolId: string;
}

interface PriceBlockProps {
  pricePerDay: number;
}

interface FilledDateRange {
  from: Date;
  to: Date;
}

interface CalendarFieldProps {
  bookedRanges: BookedRange[];
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

function isOverlapping(selected: DateRange, booked: BookedRange[]): BookedRange | null {
  return booked.find(b => selected.from! <= b.to && selected.to! >= b.from) || null;
}

function findNextAvailableRange(booked: BookedRange[], durationDays: number): FilledDateRange {
  const sorted = [...booked].sort((a, b) => a.to.getTime() - b.to.getTime());

  const lastBooked = sorted[sorted.length - 1];

  const from = new Date(lastBooked.to);
  from.setDate(from.getDate() + 1);

  const to = new Date(from);
  to.setDate(to.getDate() + durationDays);

  return { from, to };
}

// Компонент-обгортка календаря
function CalendarField({ bookedRanges }: CalendarFieldProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<BookingToolFormValues>();

  const handleChange = (range: DateRange) => {
    if (!range.from || !range.to) {
      setFieldValue("dateRange", range, true);
      return;
    }

    const duration = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const conflict = isOverlapping(range, bookedRanges);

    if (conflict) {
      const nextRange = findNextAvailableRange(bookedRanges, duration);

      toast.error(
        `Обраний період зайнятий.
Найближчі вільні дати: ${nextRange.from.toLocaleDateString()} – ${nextRange.to.toLocaleDateString()}`,
      );

      setFieldValue("dateRange", nextRange, true);
      return;
    }

    setFieldValue("dateRange", range, true);
  };

  const getErrorMessage = (): string | undefined => {
    if (!touched.dateRange || !errors.dateRange) return;
    if (typeof errors.dateRange === "string") return errors.dateRange;
    const nested = errors.dateRange as FormikErrors<DateRange>;
    return nested.from || nested.to;
  };

  return (
    <div className={styles.calendarWrapper}>
      <label className={styles.label}>Виберіть період бронювання</label>
      <BookingCalendar
        bookedRanges={bookedRanges}
        value={values.dateRange}
        onChange={handleChange}
        error={getErrorMessage()}
      />
    </div>
  );
}

function calculateDays(from: Date | null, to: Date | null): number {
  if (!from || !to) return 0;
  const diffTime = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function PriceBlock({ pricePerDay }: PriceBlockProps) {
  const { values } = useFormikContext<BookingToolFormValues>();
  const days = calculateDays(values.dateRange.from, values.dateRange.to);
  const totalPrice = days * pricePerDay;
  return <p className={styles.textPrice}>{days > 0 ? `Ціна: ${totalPrice} грн` : `Ціна: ${pricePerDay} грн`}</p>;
}

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
