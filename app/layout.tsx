import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "RentTools - Оренда інструментів",
  description: "Знайди потрібний інструмент або здай свій в оренду",
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
