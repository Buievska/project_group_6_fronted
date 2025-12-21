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

import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

interface ProfileTabsProps {
  user: any;
  initialTools: any[];
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

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const data = await getUserBookings();
      console.log("Отримані бронювання:", data);

      return data.filter(
        (b: any) => b.toolId !== null && b.toolId !== undefined
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
        profileId={user._id || user.id}
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
              bookings.map((booking: any) => (
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
