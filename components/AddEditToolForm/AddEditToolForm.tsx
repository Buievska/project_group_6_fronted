"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

import styles from "./AddEditToolForm.module.css";
import { createTool, getCategories, updateTool } from "@/lib/api/clientApi";

const PlaceholderIcon = () => (
  <svg width="64" height="64">
    <use href="/sprite.svg#icon-placeholder-form" />
  </svg>
);

interface ToolFormValues {
  name: string;
  pricePerDay: number;
  categoryId: string;
  rentalTerms: string;
  description: string;
  specifications: string;
  images?: File;
}

interface Category {
  _id: string;
  title: string;
}

interface CategoriesResponse {
  data?: Category[];
}

type Props = {
  mode: "create" | "edit";
  toolId?: string;
  initialValues?: {
    id?: string;
    name: string;
    pricePerDay: number;
    categoryId: string | number;
    terms: string;
    description: string;
    specifications: string;
    imageUrl?: string;
  };
};

const validationSchema: Yup.Schema<ToolFormValues> = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Назва повинна містити щонайменше 3 символи")
    .max(96, "Назва занадто довга (максимум 96 символів)")
    .required("Вкажіть назву інструменту"),

  pricePerDay: Yup.number()
    .typeError("Ціна має бути числом")
    .min(0, "Ціна не може бути меншою за 0")
    .required("Вкажіть ціну за день"),

  categoryId: Yup.string().required("Оберіть категорію"),

  rentalTerms: Yup.string()
    .trim()
    .min(20, "Умови оренди мають бути детальнішими (мінімум 20 символів)")
    .max(1000, "Умови оренди занадто довгі (максимум 1000 символів)")
    .required("Вкажіть умови оренди"),

  description: Yup.string()
    .trim()
    .min(20, "Опис має містити мінімум 20 символів")
    .max(2000, "Опис занадто довгий (максимум 2000 символів)")
    .required("Додайте опис інструменту"),

  specifications: Yup.string()
    .required("Вкажіть характеристики")
    .test(
      "spec-format",
      "Формат: Назва: Значення (кожен пункт з нового рядка)",
      (value) =>
        Boolean(
          value
            ?.split("\n")
            .every((line) => line.includes(":") && line.split(":")[1]?.trim())
        )
    ),

  images: Yup.mixed<File>()
    .optional()
    .test(
      "fileSize",
      "Файл занадто великий. Максимальний розмір — 1 MB",
      (file) => !file || (file && file.size <= 1024 * 1024) // Перевірка на 1MB
    )
    .test(
      "fileType",
      "Дозволені формати: JPG, PNG, WEBP",
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ),
});

export default function AddEditToolForm({
  mode,
  initialValues,
  toolId,
}: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((res: Category[] | CategoriesResponse) => {
        const cats = Array.isArray(res) ? res : res.data;
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => toast.error("Помилка завантаження категорій"));
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialValues?.imageUrl) {
      setPreview(initialValues.imageUrl);
    }
  }, [mode, initialValues]);

  const formInitialValues = useMemo<ToolFormValues>(
    () => ({
      name: initialValues?.name ?? "",
      pricePerDay: initialValues?.pricePerDay ?? 0,
      categoryId: initialValues?.categoryId
        ? String(initialValues.categoryId)
        : "",
      rentalTerms: initialValues?.terms ?? "",
      description: initialValues?.description ?? "",
      specifications: initialValues?.specifications ?? "",
      images: undefined,
    }),
    [initialValues]
  );

  const handleSubmit = async (
    values: ToolFormValues,
    { setSubmitting }: FormikHelpers<ToolFormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("pricePerDay", String(values.pricePerDay));
      formData.append("categoryId", values.categoryId);
      formData.append("rentalTerms", values.rentalTerms);
      formData.append("description", values.description);

      const specsObject: Record<string, string> = {};
      values.specifications.split("\n").forEach((line) => {
        const [key, ...valParts] = line.split(":");
        if (key && valParts.length > 0)
          specsObject[key.trim()] = valParts.join(":").trim();
      });
      formData.append("specifications", JSON.stringify(specsObject));

      if (values.images) formData.append("image", values.images);

      const tool = await (toolId
        ? updateTool(toolId, formData)
        : createTool(formData));

      toast.success(toolId ? "Інструмент оновлено!" : "Інструмент створено!");

      const newId = tool._id || tool.id || tool.data?._id;
      if (newId) router.push(`/tools/${newId}`);
      else router.push("/profile");
    } catch (error: unknown) {
      console.error(error);
      let msg = "Сталася помилка";

      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className={styles.formWrapper}>
          <div className={styles.leftSide}>
            <div className={styles.imageSection}>
              <label className={styles.titleImg}>Фото інструменту</label>
              <div className={styles.imagePreviewBox}>
                {preview ? (
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.placeholderIcon}>
                    <PlaceholderIcon />
                  </div>
                )}
              </div>
              <label className={styles.uploadBtn}>
                Завантажити фото
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("images", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              <ErrorMessage
                name="images"
                component="div"
                className={styles.formError}
              />
            </div>

            <label className={styles.formLabel}>
              Назва
              <Field
                name="name"
                className={styles.formInput}
                placeholder="Введіть назву"
              />
              <ErrorMessage
                name="name"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Ціна/день
              <Field
                name="pricePerDay"
                type="number"
                className={styles.formInput}
                placeholder="500"
              />
              <ErrorMessage
                name="pricePerDay"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Категорія
              <Field
                as="select"
                name="categoryId"
                className={styles.formSelect}
              >
                <option value="">Категорія</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Умови оренди
              <Field
                as="textarea"
                name="rentalTerms"
                className={styles.formInput}
                placeholder="Застава 8000 грн..."
              />
              <ErrorMessage
                name="rentalTerms"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Опис
              <Field
                as="textarea"
                name="description"
                className={styles.formTextarea}
                placeholder="Ваш опис"
              />
              <ErrorMessage
                name="description"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Характеристики
              <Field
                as="textarea"
                name="specifications"
                className={styles.formTextarea}
                placeholder="Характеристики інструменту"
              />
              <span className={styles.hint}>
                Формат: <b>Назва: Значення</b> (кожна з нового рядка)
              </span>
              <ErrorMessage
                name="specifications"
                component="span"
                className={styles.formError}
              />
            </label>
          </div>

          <div className={styles.rightSide}>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {mode === "create" ? "Опублікувати" : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.btnCancel}
            >
              Відмінити
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
