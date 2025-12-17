import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "RentTools - Оренда інструментів",
  description: "Знайди потрібний інструмент або здай свій в оренду",

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <TanStackProvider>
          <AuthProvider>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <main style={{ flex: 1 }}>{children}</main>
            </div>
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
