"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateUserProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, login } = useAuthStore();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        let currentUser = user;
        if (!currentUser) {
          const res = await getCurrentUser();
          currentUser = res?.data || res;
        }

        if (currentUser) {
          login(currentUser);
          setName(currentUser.name);
        } else {
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [user, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      const updatedUser = await updateUserProfile(formData);

      login(updatedUser);
      router.push(`/profile/${updatedUser._id || updatedUser.id}`);
    } catch (error) {
      alert("Помилка при збереженні. Спробуйте ще раз.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <main>
      <h1>Редагування профілю</h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "#eee",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div>
          <label>Ім'я користувача</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть нове ім'я"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        <div>
          <Link href={`/profile/${user?._id || user?.id}`}>Скасувати</Link>

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </form>
    </main>
  );
}
