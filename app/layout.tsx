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
  title: "iStudent - Nền tảng học tập trực tuyến miễn phí",
  description: "Trực quan hóa lộ trình học của bạn với sự hỗ trợ của AI. Khám phá các khóa học lập trình, trí tuệ nhân tạo, thiết kế UI/UX chất lượng cao miễn phí.",
  keywords: "istudent, hoc truc tuyen, lap trinh mien phi, AI, chatgpt, nextjs, react, ui ux design",
  authors: [{ name: "iStudent Team" }],
  openGraph: {
    title: "iStudent - Nền tảng học tập trực tuyến miễn phí",
    description: "Khám phá các khóa học lập trình, trí tuệ nhân tạo, thiết kế UI/UX chất lượng cao miễn phí.",
    type: "website",
    locale: "vi_VN",
    url: "https://istudent-demo.vercel.app",
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
