"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./FeedbackFormModal.module.css";

interface Props {
  toolId: string;
  toolName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackFormModal({
  toolId,
  toolName = "товар",
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);
  const [loading, setLoading] = useState(false);

  // Блокуємо скрол при відкритті модалки
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Закриття модалки по Esc
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rate === 0) {
      toast.error("Будь ласка, виберіть оцінку");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://project-group-6-backend.onrender.com/api/feedbacks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            toolId,
            name,
            description,
            rate,
          }),
        }
      );

      if (!response.ok) throw new Error("Помилка надсилання");

      toast.success("Відгук успішно додано!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Не вдалося надіслати відгук");
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
          Залишити відгук на <br /> {toolName}
        </h2>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label}>
            Імʼя
            <input
              className={styles.input}
              placeholder="Ваше імʼя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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

          <button
            type="submit"
            className={styles.submit}
            disabled={loading || rate === 0}
          >
            {loading ? "Надсилаємо..." : "Надіслати"}
          </button>
        </form>
      </div>
    </div>
  );
}
