import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider"; // Створіть заглушку
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <AuthProvider>
            {/* Header */}
            <main>{children}</main>
            {/*  Footer */}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
