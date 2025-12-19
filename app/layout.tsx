import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {

  title: "ToolNext - Платформа для інструментів",
  description: "ToolNext — платформа для швидкої та зручної оренди інструментів",
  openGraph: {
    title: "ToolNext",
    description: "Платформа для швидкої та зручної оренди інструментів",
    url: "https://toolnext.app", // підставити сюди реальну URL коли буде
    siteName: "ToolNext",
    type: "website",
        icons: {
    icon: "/favicon.svg",

  },
    images: [
      {
        url: "/og-toolnext.jpg", 
        width: 1200,
        height: 630,
        alt: "ToolNext preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNext",
    description: "Платформа для швидкої та зручної оренди інструментів",
    images: ["/og-toolnext.jpg"],

  title: "RentTools - Оренда інструментів",
  description: "Знайди потрібний інструмент або здай свій в оренду",
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
