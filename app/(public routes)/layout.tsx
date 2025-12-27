import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanStackProvider>
      <AuthProvider>
        <div className="app-wrapper">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </TanStackProvider>
  );
}
