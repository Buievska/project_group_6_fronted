"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/components/UserProfile/UserProfile";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";
import BookingCard from "@/components/BookingCard/BookingCard";
import { ProfilePlaceholder } from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import { getUserBookings, deleteBooking } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ProfileTabs.module.css";
import gridCss from "@/components/ToolsGrid/ToolsGrid.module.css";
import { Tool } from "@/types/tool"; // Передбачаємо, що у вас є цей тип

import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

// Інтерфейс для користувача профілю
interface ProfileUser {
  _id?: string;
  id?: string;
  name: string;
  avatar?: string;
}

// Інтерфейс для бронювання (має збігатися з очікуваннями BookingCard)
interface Booking {
  _id: string;
  toolId: {
    _id: string;
    name: string;
    pricePerDay: string | number;
    images?: string | string[];
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
}

interface ProfileTabsProps {
  user: ProfileUser;
  initialTools: Tool[];
  totalToolsCount: number;
  userId: string;
}

export default function ProfileTabs({
  user,
  initialTools,
  totalToolsCount,
  userId,
}: ProfileTabsProps) {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"tools" | "bookings">("tools");
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const isOwner = currentUser?._id === userId || currentUser?.id === userId;

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<
    Booking[]
  >({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const data = await getUserBookings();
      // data зазвичай приходить як масив або об'єкт з масивом,
      // переконайтеся, що getUserBookings повертає масив
      const results = Array.isArray(data) ? data : data.data || [];

      return results.filter(
        (b: Booking) => b.toolId !== null && b.toolId !== undefined
      );
    },
    enabled: activeTab === "bookings" && isOwner,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setIsModalOpen(false);
      setBookingToDelete(null);
    },
    onError: (error) => {
      console.error("Не вдалося видалити", error);
      alert("Сталася помилка при видаленні");
    },
  });

  const openDeleteModal = (id: string) => {
    setBookingToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      deleteMutation.mutate(bookingToDelete);
    }
  };

  return (
    <div className={css.wrapper}>
      <UserProfile
        userName={user.name}
        avatarUrl={user.avatar}
        profileId={user._id || user.id || ""}
      />

      {isOwner && (
        <div className={css.tabs}>
          <button
            className={`${css.tab} ${activeTab === "tools" ? css.active : ""}`}
            onClick={() => setActiveTab("tools")}
          >
            Мої оголошення
          </button>
          <button
            className={`${css.tab} ${activeTab === "bookings" ? css.active : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Мої оренди
          </button>
        </div>
      )}

      {!isOwner && <h2 className={css.sectionTitle}>Інструменти</h2>}

      <div className={css.content}>
        {activeTab === "tools" ? (
          initialTools.length > 0 ? (
            <ToolsGrid
              userId={userId}
              initialTools={initialTools}
              totalToolsCount={totalToolsCount}
              limit={8}
            />
          ) : (
            <ProfilePlaceholder isOwner={isOwner} />
          )
        ) : (
          <ul className={gridCss.toolsList}>
            {!isLoadingBookings &&
              bookings.map((booking: Booking) => (
                <li key={booking._id} className={gridCss.toolsItem}>
                  <BookingCard booking={booking} onCancel={openDeleteModal} />
                </li>
              ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <ConfirmationModal
          title="Ви дійсно хочете скасувати це бронювання?"
          confirmButtonText="Так, скасувати"
          cancelButtonText="Назад"
          confirmButtonColor="#ef4444"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
