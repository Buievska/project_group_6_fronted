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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const words = title.split(' ');

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onCancel} aria-label="Close modal">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.186 0.986c0.781-0.781 2.047-0.781 2.828 0s0.781 2.047 0 2.828l-12.186 12.186 12.186 12.186 0.137 0.152c0.641 0.786 0.595 1.944-0.137 2.677s-1.891 0.778-2.677 0.137l-0.152-0.137-12.186-12.186-12.186 12.186c-0.781 0.781-2.047 0.781-2.828 0s-0.781-2.047 0-2.828l12.186-12.186-12.186-12.186-0.137-0.152c-0.641-0.786-0.595-1.944 0.137-2.677s1.891-0.778 2.677-0.137l0.152 0.137 12.186 12.186 12.186-12.186z"/>
          </svg>
        </button>

        <h2 className={styles.title}>
          {words.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </h2>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel} disabled={isLoading}>
            {cancelButtonText}
          </button>

          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: confirmButtonColor,
              borderColor: confirmButtonColor,
            }}
          >
            {isLoading ? 'Завантаження...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
