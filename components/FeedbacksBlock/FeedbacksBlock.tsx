"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import FeedbackCard from "./FeedbackCard";
import Icon from "./Icon";
import AuthRequiredModal from "../AuthRequiredModal/AuthRequiredModal";
import FeedbackFormModal from "../FeedbackFormModal/FeedbackFormModal";
import { useAuthStore } from "@/lib/store/authStore";

import styles from "./FeedbacksBlock.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
  tool?: string | { _id: string };
}

interface FeedbacksResponse {
  status: string;
  code: number;
  page: number;
  perPage: number;
  totalFeedbacks: number;
  totalPages: number;
  data: { feedbacks: Feedback[] };
}

interface FeedbacksBlockProps {
  productId?: string;
  title?: string;
  showLeaveButton?: boolean;
  isToolsPage?: boolean;
  isAuth: boolean;
}

const FeedbacksBlock: React.FC<FeedbacksBlockProps> = ({
  productId,
  title = "Остані відгуки",
  showLeaveButton = false,
  isToolsPage = false,
}) => {
  const { user } = useAuthStore();
  const isAuth = !!user;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://project-group-6-backend.onrender.com/api/feedbacks?page=1&perPage=1000"
      );
      if (!response.ok) throw new Error("Не вдалося завантажити відгуки");

      const result: FeedbacksResponse = await response.json();

      const filteredFeedbacks = productId
        ? result.data.feedbacks
            .filter((fb) =>
              typeof fb.tool === "string"
                ? fb.tool === productId
                : fb.tool?._id === productId
            )
            .slice(0, 10)
        : result.data.feedbacks.slice(0, 10);

      setFeedbacks(filteredFeedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleLeaveFeedbackClick = () => {
    if (isAuth) setShowFeedbackModal(true);
    else setShowAuthModal(true);
  };

  if (loading)
    return (
      <section
        className={`${styles.feedbacksSection} ${
          isToolsPage ? styles.toolsPage : ""
        }`}
      >
        <div
          className={
            isToolsPage
              ? styles.toolsPageContainerFeedbacksBlock
              : styles.containerFeedbacksBlock
          }
        >
          <h2 className={styles.title}>{title}</h2>
          <p>Завантаження відгуків...</p>
        </div>
      </section>
    );

  if (error)
    return (
      <section
        className={`${styles.feedbacksSection} ${
          isToolsPage ? styles.toolsPage : ""
        }`}
      >
        <div
          className={
            isToolsPage
              ? styles.toolsPageContainerFeedbacksBlock
              : styles.containerFeedbacksBlock
          }
        >
          <h2 className={styles.title}>{title}</h2>
          <p>Помилка: {error}</p>
        </div>
      </section>
    );

  return (
    <section
      className={`${styles.feedbacksSection} ${
        isToolsPage ? styles.toolsPage : ""
      }`}
    >
      <div
        className={
          isToolsPage
            ? styles.toolsPageContainerFeedbacksBlock
            : styles.containerFeedbacksBlock
        }
      >
        <div className={styles.headerBlock}>
          <h2 className={styles.title}>{title}</h2>
          {showLeaveButton && (
            <button
              className={styles.leaveFeedbackBtn}
              onClick={handleLeaveFeedbackClick}
            >
              Залишити відгук
            </button>
          )}
        </div>

        {feedbacks.length === 0 && (
          <p className={styles.emptyProductText}>
            <span className={styles.emptyTitle}>
              У цього інструменту немає жодного відгуку
            </span>
            <span className={styles.emptySubtitle}>
              Ми впевнені, скоро їх буде значно більше!
            </span>
          </p>
        )}

        {feedbacks.length > 0 && (
          <div className={styles.swiperWrapper}>
            {feedbacks.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={32}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  el: ".swiper-pagination-custom",
                  clickable: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 3,
                  type: "bullets",
                }}
                breakpoints={{
                  375: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1440: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className={styles.swiper}
              >
                {feedbacks.map((feedback) => (
                  <SwiperSlide key={feedback._id}>
                    <FeedbackCard feedback={feedback} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              feedbacks.map((feedback) => (
                <FeedbackCard key={feedback._id} feedback={feedback} />
              ))
            )}

            {feedbacks.length > 1 && (
              <div className={styles.navigationBlock}>
                <div
                  className={`swiper-pagination-custom ${styles.customPagination}`}
                ></div>
                <div className={styles.navigationButtons}>
                  <button
                    className="swiper-button-prev-custom"
                    aria-label="Попередній слайд"
                  >
                    <Icon name="left-arrow" width={24} height={24} />
                  </button>
                  <button
                    className="swiper-button-next-custom"
                    aria-label="Наступний слайд"
                  >
                    <Icon name="right-arrow" width={24} height={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showAuthModal && (
          <AuthRequiredModal onClose={() => setShowAuthModal(false)} />
        )}
        {showFeedbackModal && productId && (
          <FeedbackFormModal
            productId={productId}
            onClose={() => setShowFeedbackModal(false)}
            onSuccess={fetchFeedbacks}
          />
        )}
      </div>
    </section>
  );
};

export default FeedbacksBlock;