"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./HeroBlock.module.css";

const SearchSchema = Yup.object().shape({
  query: Yup.string().required("Будь ласка, введіть пошуковий запит"),
});

export default function HeroBlock() {
  const router = useRouter();

  return (
    <section className={styles.heroBlock}>
      <div className={styles.overlay}></div>
      <h1 className={styles.title}>ToolNext — ваш надійний сусід</h1>

      <Formik
        initialValues={{ query: "" }}
        validationSchema={SearchSchema}
        onSubmit={(values) => {
          const query = values.query.trim();
          if (!query) return;
          router.push(`/tools?search=${encodeURIComponent(query)}`);
        }}
      >
        {({ errors, touched }) => (
          <Form className={styles.heroSearch}>
            <div className={styles.inputWrapper}>
              <Field
                name="query"
                type="text"
                placeholder="Дриль алмазного свердління"
                className={`${styles.input} ${
                  errors.query && touched.query ? styles.inputError : ""
                }`}
              />
              <ErrorMessage
                name="query"
                component="div"
                className={styles.error}
              />
            </div>
            <button type="submit" className={styles.button}>
              Пошук
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
