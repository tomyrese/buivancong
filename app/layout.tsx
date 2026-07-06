import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "iStudent - Nền tảng luyện thi ĐGNL chất lượng cao",
  description: "Trực quan hóa lộ trình học của bạn. Ôn thi Đánh giá Năng lực cùng Thầy Bùi Văn Công.",
  keywords: "istudent, hoc truc tuyen, luyen thi dgnl, thuy bui van cong, toan logic",
  authors: [{ name: "iStudent Team" }],
  openGraph: {
    title: "iStudent - Nền tảng luyện thi ĐGNL chất lượng cao",
    description: "Ôn thi Đánh giá Năng lực cùng Thầy Bùi Văn Công.",
    type: "website",
    locale: "vi_VN",
    url: "https://istudent.vn",
    siteName: "iStudent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
