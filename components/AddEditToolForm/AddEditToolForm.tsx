"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import styles from "./AddEditToolForm.module.css";
import Loader from "@/components/Loader/Loader";
import { createTool, getCategories } from "@/lib/api/clientApi";

type Props = {
  mode: "create" | "edit";
  initialValues?: any;
};

const validationSchema = Yup.object({
  title: Yup.string().min(3).required("Вкажіть назву"),
  pricePerDay: Yup.number().positive().required("Вкажіть ціну"),
  category: Yup.string().required("Оберіть категорію"),
  rentalConditions: Yup.string().required("Вкажіть умови оренди"),
  description: Yup.string().required("Вкажіть опис"),
  characteristics: Yup.string().required("Вкажіть характеристики"),
});

export default function AddEditToolForm({ mode, initialValues }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => toast.error("Помилка завантаження категорій"));
  }, []);

  const formInitialValues = useMemo(
    () => ({
      image: null,
      title: "",
      pricePerDay: "",
      category: "",
      rentalConditions: "",
      description: "",
      characteristics: "",
    }),
    []
  );

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      const tool = await createTool(formData);
      router.push(`/tools/${tool.id}`);
    } catch (error: any) {
      toast.error(error.message || "Помилка збереження");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className={styles.formWrapper}>
          {/* Ліва частина: фото + форма */}
          <div className={styles.leftSide}>
            <label className={styles.imageField}>
              {preview ? (
                <img src={preview} alt="preview" />
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
                  setFieldValue("image", file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            <label className={styles.formLabel}>
              Назва
              <Field name="title" className={styles.formInput} />
              <ErrorMessage
                name="title"
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
              <Field as="select" name="category" className={styles.formSelect}>
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
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
                name="characteristics"
                className={styles.formTextarea}
              />
              <ErrorMessage
                name="characteristics"
                component="span"
                className={styles.formError}
              />
            </label>
          </div>

          {/* Права частина: кнопки */}
          <div className={styles.rightSide}>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              Опублікувати
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
