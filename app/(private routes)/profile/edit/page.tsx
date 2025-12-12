"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useEffect, useState } from "react";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/lib/store/authStore";

const EditProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    getMe().then((user) => {
      setUserName(user.username ?? "");
      setUserEmail(user.email ?? "");
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userName.length === 0) {
      return toast.error("Please, fiil Username area");
    }
    if (userName.length > 24) {
      return toast.error("Username cannot exceed 24 characters");
    }

    const updatedUser = await updateMe({ username: userName });
    if (updatedUser) {
      setUser(updatedUser);
      toast.success("Success");
    }

    router.push("/profile");
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="https://ac.goit.global/fullstack/react/default-avatar.jpg"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={userName}
              className={css.input}
              onChange={handleChange}
            />
          </div>

          <p>Email: {userEmail}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={router.back}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </main>
  );
};
export default EditProfile;
