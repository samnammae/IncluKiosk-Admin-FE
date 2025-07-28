import "./globals.css";
import LoginModal from "@/components/layout/modal/LoginModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <LoginModal />
      </body>
    </html>
  );
}
