"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ToolInfoBlock.module.css";
import { Tool } from "@/types/tool";
import { UserProfile } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import AuthRequiredModal from "@/components/AuthRequiredModal/AuthRequiredModal";
import { getUserById } from "@/lib/api/clientApi";

interface Props {
  tool: Tool;
}

export default function ToolInfoBlock({ tool }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [owner, setOwner] = useState<UserProfile | null>(null);

  // Виправляємо Error: Unexpected any
  // Визначаємо safeOwnerId, перевіряючи чи є owner об'єктом (populated) чи рядком (ID)
  const safeOwnerId =
    typeof tool.owner === "object" && tool.owner !== null
      ? (tool.owner as { _id: string })._id
      : (tool.owner as string);

  const isOwner = user?._id === safeOwnerId;

  const renderSpecifications = (
    specs: string | Record<string, string | number>
  ) => {
    if (!specs) return null;

    if (typeof specs === "string") {
      return <p className={styles.text}>{specs}</p>;
    }

    if (typeof specs === "object") {
      return (
        <ul className={styles.specsList}>
          {Object.entries(specs).map(([key, value]) => (
            <li key={key} className={styles.specItem}>
              <span className={styles.specKey}>{key}:</span>{" "}
              <span className={styles.specValue}>{String(value)}</span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchOwner = async () => {
      if (!safeOwnerId) return;

      try {
        const ownerData = await getUserById(safeOwnerId);
        setOwner(ownerData);
      } catch (e) {
        console.error("Не вдалося завантажити дані власника:", e);
      }
    };
    fetchOwner();
  }, [safeOwnerId]);

  const handleBookingClick = () => {
    if (user) {
      router.push(`/tools/${tool._id}/booking`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleEditClick = () => {
    router.push(`/tools/${tool._id}/edit`);
  };

  const ownerAvatar = owner?.avatarUrl;
  const ownerName = owner?.name || "Завантаження...";
  const ownerInitial = (ownerName[0] || "U").toUpperCase();
  const finalProfileId = owner?._id || safeOwnerId;

  return (
    <div className={styles.infoContainer}>
      <h1 className={styles.title}>{tool.name}</h1>
      <p className={styles.price}>{tool.pricePerDay} грн/день</p>

      <div className={styles.ownerBlock}>
        <div className={styles.avatarWrapper}>
          {ownerAvatar ? (
            <Image
              src={ownerAvatar}
              alt={ownerName}
              width={64}
              height={64}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.initialAvatar}>{ownerInitial}</div>
          )}
        </div>

        <div className={styles.ownerData}>
          <p className={styles.ownerName}>{ownerName}</p>
          {finalProfileId && (
            <Link
              href={`/profile/${finalProfileId}`}
              className={styles.profileLink}
            >
              Переглянути профіль
            </Link>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.description}>{tool.description}</p>
      </div>

      {tool.specifications && (
        <div className={styles.section}>
          {renderSpecifications(tool.specifications)}
        </div>
      )}

      {tool.rentalTerms && (
        <div className={styles.section}>
          <h3 className={styles.label}>Умови оренди:</h3>
          <p className={styles.text}>{tool.rentalTerms}</p>
        </div>
      )}

      {isOwner ? (
        <button onClick={handleEditClick} className={styles.bookBtn}>
          Редагувати оголошення
        </button>
      ) : (
        <button onClick={handleBookingClick} className={styles.bookBtn}>
          Забронювати
        </button>
      )}

      {isAuthModalOpen && (
        <AuthRequiredModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
}
