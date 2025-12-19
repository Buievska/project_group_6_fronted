import { useEffect, useState } from 'react';
import styles from './ConfirmationModal.module.css';

export interface ConfirmationModalProps {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmButtonColor?: string;
}

const ConfirmationModal = ({
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  confirmButtonColor = '#8808cc',
}: ConfirmationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onCancel();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const words = title.split(' ');

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      style={
        {
          '--confirm-color': confirmButtonColor,
        } as React.CSSProperties
      }
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onCancel} aria-label="Close modal">
          ✕
        </button>

        <h2 className={styles.title}>
          {words.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </h2>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>

          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
