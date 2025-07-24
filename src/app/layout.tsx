import "./globals.css";
import LoginModal from "@/components/layout/LoginModal";

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
