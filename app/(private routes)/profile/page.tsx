import { Metadata } from "next";
import css from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | Note Hub",
  description: "Page for viewing and editing profile",
  icons: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  openGraph: {
    title: "Profile | Note Hub",
    description: "Page for viewing and editing profile",
    url: "https://08-zustand-jet.vercel.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile | Note Hub",
      },
    ],
  },
};

const Profile = async () => {
  const user = await getServerMe();

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
