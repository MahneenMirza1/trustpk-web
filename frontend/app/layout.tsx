import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SplashProvider } from "@/components/splash/SplashProvider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TrustPK — Your Trusted Digital Assistant for Pakistan",
    template: "%s · TrustPK",
  },
  description: siteConfig.description,
  applicationName: "TrustPK",
  keywords: [
    "TrustPK",
    "Pakistan",
    "universities",
    "government jobs",
    "scholarships",
    "government schemes",
    "verification",
    "AI assistant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex min-h-screen flex-col bg-page font-sans antialiased`}>
        <SplashProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </SplashProvider>
      </body>
    </html>
  );
}
