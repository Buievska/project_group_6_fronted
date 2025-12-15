import React from 'react';
import StarRating from './StarRating';
import styles from './FeedbacksBlock.module.css';

interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return (
    <div className={styles.feedbackCard}>
      <StarRating rating={feedback.rate} />
      <p className={styles.feedbackText}>{feedback.description}</p>
      <p className={styles.feedbackAuthor}>{feedback.name}</p>
    </div>
  );
};

export default FeedbackCard;