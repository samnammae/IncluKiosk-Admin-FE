import "./globals.css";
import LoginModal from "@/components/layout/modal/LoginModal";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
        <LoginModal />
      </body>
    </html>
  );
}
