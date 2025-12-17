"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

import styles from "./AddEditToolForm.module.css";
import { createTool, getCategories } from "@/lib/api/clientApi";

interface Category {
  id: string;
  name: string;
}

interface ToolFormValues {
  name: string;
  pricePerDay: number;
  categoryId: string;
  rentalConditions: string;
  description: string;
  specifications: string;
  images?: File;
}

type Props = {
  mode: "create" | "edit";
  initialValues?: {
    id?: string;
    name: string;
    pricePerDay: number;
    categoryId: string;
    rentalConditions: string;
    description: string;
    specifications: string;
    imageUrl?: string;
  };
};

const validationSchema: Yup.Schema<ToolFormValues> = Yup.object({
  name: Yup.string().min(3).required("Вкажіть назву"),
  pricePerDay: Yup.number().positive().required("Вкажіть ціну"),
  categoryId: Yup.string().required("Оберіть категорію"),
  rentalConditions: Yup.string().required("Вкажіть умови оренди"),
  description: Yup.string().required("Вкажіть опис"),
  specifications: Yup.string().required("Вкажіть характеристики"),
  images: Yup.mixed<File>().optional(),
});

export default function AddEditToolForm({ mode, initialValues }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
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
      categoryId: initialValues?.categoryId ?? "",
      rentalConditions: initialValues?.rentalConditions ?? "",
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
      formData.append("rentalConditions", values.rentalConditions);
      formData.append("description", values.description);
      formData.append("specifications", values.specifications);

      if (values.images) {
        formData.append("images", values.images);
      }

      const tool = await createTool(formData);
      router.push(`/tools/${tool.id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Помилка збереження");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className={styles.formWrapper}>
          <div className={styles.leftSide}>
            <label className={styles.imageField}>
              {preview ? (
                <Image
                  src={preview}
                  alt="preview"
                  width={200}
                  height={200}
                  className={styles.previewImage}
                />
              ) : (
                <span>Додати фото</span>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (!file) return;
                  setFieldValue("images", file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            <label className={styles.formLabel}>
              Назва
              <Field name="name" className={styles.formInput} />
              <ErrorMessage
                name="name"
                component="span"
                className={styles.formError}
              />
            </label>

            <label className={styles.formLabel}>
              Ціна / день
              <Field
                name="pricePerDay"
                type="number"
                className={styles.formInput}
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
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                name="rentalConditions"
                className={styles.formTextarea}
              />
              <ErrorMessage
                name="rentalConditions"
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
              />
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
