import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORCA FINANCIAL | Intelligent Investment Dashboard",
  description: "Bảng tin tài chính thông minh hàng ngày - Phân tích thị trường, chiến lược đầu tư, và khuyến nghị cổ phiếu từ ORCA FINANCIAL.",
  keywords: "VNINDEX, VN30, chứng khoán, đầu tư, phân tích kỹ thuật, thị trường tài chính",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
