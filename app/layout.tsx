import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";
import SocialIcons from "@/components/SocialIcons";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <ScrollToTop />
            <Navbar />
            {children}
            <SocialIcons />
            <ToastContainer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
