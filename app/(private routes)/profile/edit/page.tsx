"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateUserProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import Image from "next/image";
import css from "./EditPageProfil.module.css";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import axios from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, login } = useAuthStore();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
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
          setName(currentUser.name || "");
          setAvatarUrl(currentUser.avatarUrl || "");
        } else {
          router.push("/login");
        }
      } catch (e) {
        console.error("Помилка:", e);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [user, login, router]);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info;
    if (typeof info !== "string" && info?.secure_url) {
      setAvatarUrl(info.secure_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const dataToSend = {
        name: name,
        avatarUrl: avatarUrl || undefined,
      };

      const updatedUser = await updateUserProfile(userId, dataToSend);

      login(updatedUser);
      router.push(`/profile/${updatedUser._id || updatedUser.id}`);
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      let message = "Помилка при збереженні";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Завантаження...
      </div>
    );

  return (
    <main className={css.container}>
      <h1 className={css.title}>Редагування профілю</h1>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.avatarSection}>
          <div
            className={css.avatarWrapper}
            style={{ position: "relative", overflow: "hidden" }}
          >
            {avatarUrl || user?.avatarUrl ? (
              <Image
                src={avatarUrl || user?.avatarUrl || ""}
                alt="Avatar"
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <CldUploadButton
            uploadPreset="my_toolnext_preset"
            onSuccess={handleUploadSuccess}
            className={`${css.uploadBtn}`}
          >
            Завантажити нове фото
          </CldUploadButton>
        </div>

        <div className={css.inputGroup}>
          <label className={css.label}>Ім{"'"}я користувача</label>
          <input
            className={css.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть ваше ім'я"
          />
        </div>

        <div className={css.inputGroup}>
          <label className={css.label}>Email</label>
          <input
            className={css.input}
            type="email"
            defaultValue={user?.email}
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
        </div>

        <div className={css.buttonGroup}>
          <Link
            href={`/profile/${user?._id || user?.id}`}
            className={`${css.btn} ${css.btnSecondary}`}
          >
            Скасувати
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className={`${css.btn} ${css.btnPrimary}`}
          >
            {isSaving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </form>
    </main>
  );
}
