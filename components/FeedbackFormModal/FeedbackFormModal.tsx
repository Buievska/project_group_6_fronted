"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./FeedbackFormModal.module.css";

interface Props {
  productId: string;
  productName?: string;
  onClose: () => void;
  onSuccess: () => void;
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

  // Блокування скролу
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Закриття по Escape
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Будь ласка, введіть імʼя");
    if (!description.trim()) return toast.error("Будь ласка, введіть відгук");
    if (rate === 0) return toast.error("Будь ласка, виберіть оцінку");

    setLoading(true);

    try {
      const payload = {
        toolId: productId,
        description,
        rate,
      };

      // ✅ Відправка через cookies, без Authorization заголовку
      await axios.post(
        "https://project-group-6-backend.onrender.com/api/feedbacks",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Відгук успішно додано!");
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Не вдалося надіслати відгук"
        );
      } else {
        toast.error("Невідома помилка");
      }
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
