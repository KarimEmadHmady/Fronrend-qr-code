import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
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
    <html lang="en"  >
      <head></head>
      <body>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <ToastContainer />
          {children}
          <SocialIcons />
        </AuthProvider>
      </body>
    </html>
  );
}
