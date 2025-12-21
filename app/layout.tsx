import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
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
    url: "https://project-group-6-fronted.vercel.app", // підставити сюди реальну URL коли буде
    siteName: "ToolNext",
    type: "website",
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
            <div className="flex flex-col min-h-screen">
              <Header />
              <main
                style={{
                  flex: 1,
                  minHeight: "calc(100vh - var(--header-height))",
                }}
              >
                {children}
              </main>
              {modal}
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
