import React from "react";
import StarRating from "./StarRating";
import styles from "./FeedbacksBlock.module.css";

interface Feedback {
  _id: string;
  name?: string; // Робимо необов'язковим
  description: string;
  rate: number;
  // Додаємо можливі вкладені об'єкти від бекенду
  userId?: { name: string };
  owner?: { name: string };
  author?: { name: string };
}

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const authorName =
    feedback.owner?.name ||
    feedback.userId?.name ||
    feedback.author?.name ||
    feedback.name ||
    "Користувач";
  return (
    <div className={styles.feedbackCard}>
      <StarRating rating={feedback.rate} />
      <p className={styles.feedbackText}>{feedback.description}</p>
      <p className={styles.feedbackAuthor}>{authorName}</p>
    </div>
  );
};

export default FeedbackCard;
