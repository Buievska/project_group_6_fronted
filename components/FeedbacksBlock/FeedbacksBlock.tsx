"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import axios from "axios";
import FeedbackCard from "./FeedbackCard";
import Icon from "./Icon";
import AuthRequiredModal from "../AuthRequiredModal/AuthRequiredModal";
import FeedbackFormModal from "../FeedbackFormModal/FeedbackFormModal";
import { useAuthStore } from "@/lib/store/authStore";
import { $api } from "@/lib/api/api";
import { getFeedbacksByToolId, getUserFeedbacks } from "@/lib/api/clientApi";

import styles from "./FeedbacksBlock.module.css";
import "swiper/css";
import "swiper/css/navigation";

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
  data: { feedbacks: Feedback[] };
}

interface FeedbacksBlockProps {
  productId?: string;
  userId?: string;
  title?: string;
  showLeaveButton?: boolean;
  isToolsPage?: boolean;
  isProfilePage?: boolean;
}

const FeedbacksBlock: React.FC<FeedbacksBlockProps> = ({
  productId,
  userId,
  title = "Останні відгуки",
  showLeaveButton = false,
  isToolsPage = false,
  isProfilePage = false,
}) => {
  const { user } = useAuthStore();
  const isAuth = !!user;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Для кастомної пагінації
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let fetchedData: Feedback[] = [];

      if (userId) {
        const response = await getUserFeedbacks(userId);
        fetchedData = response.feedbacks;
      } else if (productId) {
        const response = await getFeedbacksByToolId(productId);
        fetchedData = response.data.feedbacks;
      } else {
        const response = await $api.get<FeedbacksResponse>("/feedbacks", {
          params: { perPage: 10 },
        });
        fetchedData = response.data.data.feedbacks;
      }
      setFeedbacks(fetchedData);
    } catch (err: unknown) {
      let errorMessage = "Не вдалося завантажити відгуки";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [productId, userId]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const getNavClass = () => {
    const len = feedbacks.length;
    if (len <= 1) return styles.hideAlways;
    if (len <= 2) return styles.hideTabletUp;
    if (len <= 3) return styles.hideDesktop;
    return "";
  };

  const handleLeaveFeedbackClick = () => {
    if (isAuth) setShowFeedbackModal(true);
    else setShowAuthModal(true);
  };

  const getContainerClass = () => {
    if (isToolsPage) return styles.toolsPageContainerFeedbacksBlock;
    if (isProfilePage) return styles.profilePageContainer;
    return styles.containerFeedbacksBlock;
  };

  // Функція для генерації крапок пагінації (максимум 5)
  const renderPaginationDots = () => {
    if (totalSlides <= 1) return null;

    const maxDots = 5;
    const dots: React.ReactNode[] = [];

    let startIndex = 0;
    let endIndex = totalSlides - 1;

    if (totalSlides > maxDots) {
      // Визначаємо діапазон крапок для відображення
      const half = Math.floor(maxDots / 2);

      if (activeIndex <= half) {
        // На початку - показуємо перші 5
        startIndex = 0;
        endIndex = maxDots - 1;
      } else if (activeIndex >= totalSlides - half - 1) {
        // В кінці - показуємо останні 5
        startIndex = totalSlides - maxDots;
        endIndex = totalSlides - 1;
      } else {
        // В середині - activeIndex по центру
        startIndex = activeIndex - half;
        endIndex = activeIndex + half;
      }
    }

    for (let i = startIndex; i <= endIndex; i++) {
      const isActive = i === activeIndex;
      const distance = Math.abs(i - activeIndex);

      let sizeClass = styles.dotMedium;
      if (isActive) {
        sizeClass = styles.dotLarge;
      } else if (distance === 1) {
        sizeClass = styles.dotMedium;
      } else if (distance >= 2) {
        sizeClass = styles.dotSmall;
      }

      dots.push(
        <button
          key={i}
          className={`${styles.paginationDot} ${isActive ? styles.dotActive : ""} ${sizeClass}`}
          onClick={() => swiperRef.current?.slideTo(i)}
          aria-label={`Перейти до слайду ${i + 1}`}
        />
      );
    }

    return dots;
  };

  if (loading || error)
    return (
      <section
        className={`${styles.feedbacksSection} ${isToolsPage ? styles.toolsPage : ""} ${isProfilePage ? styles.profilePage : ""}`}
      >
        <div className={getContainerClass()}>
          <h2 className={styles.title}>{title}</h2>
          <p>{loading ? "Завантаження відгуків..." : `Помилка: ${error}`}</p>
        </div>
      </section>
    );

  return (
    <section
      className={`${styles.feedbacksSection} ${isToolsPage ? styles.toolsPage : ""} ${isProfilePage ? styles.profilePage : ""}`}
    >
      <div className={getContainerClass()}>
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

        {feedbacks.length === 0 ? (
          <p className={styles.emptyProductText}>
            <span className={styles.emptyTitle}>
              {userId
                ? "У цього користувача поки немає жодного відгуку"
                : "У цього інструменту немає жодного відгуку"}
            </span>
            <span className={styles.emptySubtitle}>
              Ми впевнені, скоро їх буде значно більше!
            </span>
          </p>
        ) : (
          <div className={styles.swiperWrapper}>
            <Swiper
              key={(productId ?? userId ?? "main") + feedbacks.length}
              modules={[Navigation]}
              spaceBetween={32}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setTotalSlides(swiper.slides.length);
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
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

            {feedbacks.length > 1 && (
              <div className={`${styles.navigationBlock} ${getNavClass()}`}>
                <div className={styles.customPagination}>
                  {renderPaginationDots()}
                </div>
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