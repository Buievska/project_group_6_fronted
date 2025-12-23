"use client";

import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./FeedbackFormModal.module.css";
import { $api } from "@/lib/api/api";

interface Props {
  productId: string;
  productName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  message?: string;
  details?: unknown;
}

export default function FeedbackFormModal({
  productId,
  productName = "товар",
  onClose,
  onSuccess,
}: Props) {
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || rate === 0) {
      return toast.error("Заповніть усі поля та поставте оцінку");
    }

    setLoading(true);

    try {
      const payload = {
        toolId: productId,
        description: description.trim(),
        rate: Number(rate),
      };

      console.log("Відправляємо на сервер:", payload);

      await $api.post("/feedbacks", payload);

      toast.success("Відгук успішно додано!");
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;

      console.error("Помилка 400. Деталі від сервера:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Помилка валідації. Перевірте дані"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>
          Залишити відгук на <br /> {productName}
        </h2>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label}>
            Імʼя
            <input
              className={styles.input}
              placeholder="Ваше імʼя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Відгук
            <textarea
              className={styles.textarea}
              placeholder="Ваш відгук"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className={styles.rating}>
            <span className={styles.ratingLabel}>Оцінка</span>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`${styles.star} ${
                    (hoverRate || rate) >= i ? styles.filled : ""
                  }`}
                  onClick={() => setRate(i)}
                  onMouseEnter={() => setHoverRate(i)}
                  onMouseLeave={() => setHoverRate(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Надсилаємо..." : "Надіслати"}
          </button>
        </form>
      </div>
    </div>
  );
}
