"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ToolInfoBlock.module.css";
import { Tool } from "@/types/tool";
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

  const [owner, setOwner] = useState({
    name: "Власник",
    avatar: "",
    id: tool.ownerId,
  });

  // Функція для рендеру характеристик

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
      try {
        const ownerData = await getUserById(tool.ownerId);
        if (ownerData) {
          setOwner({
            name: ownerData.name || "Власник",
            avatar: ownerData.avatar || "",
            id: ownerData._id || tool.ownerId,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (tool.ownerId) fetchOwner();
  }, [tool.ownerId]);

  const handleBookingClick = () => {
    if (user) {
      router.push(`/tools/${tool._id}/booking`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className={styles.infoContainer}>
      {/* 1. Назва */}
      <h1 className={styles.title}>{tool.name}</h1>

      {/* 2. Ціна */}
      <p className={styles.price}>{tool.pricePerDay} грн/день</p>

      {/* 3. Блок власника */}
      <div className={styles.ownerBlock}>
        <div className={styles.avatarWrapper}>
          {owner.avatar ? (
            <Image
              src={owner.avatar}
              alt={owner.name}
              width={64} // Трохи більше фото, як на макеті
              height={64}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.initialAvatar}>
              {(owner.name?.[0] || "U").toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.ownerData}>
          <p className={styles.ownerName}>{owner.name}</p>
          <Link href={`/profile/${owner.id}`} className={styles.profileLink}>
            Переглянути профіль
          </Link>
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

      {tool.terms && (
        <div className={styles.section}>
          <h3 className={styles.label}>Умови оренди:</h3>
          <p className={styles.text}>{tool.terms}</p>
        </div>
      )}

      <button onClick={handleBookingClick} className={styles.bookBtn}>
        Забронювати
      </button>

      {isAuthModalOpen && (
        <AuthRequiredModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
}
