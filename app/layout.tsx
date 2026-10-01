import type { Metadata } from "next";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.earnpouch.com"),
  title: { default: "EarnPouch | Make your money go further", template: "%s | EarnPouch" },
  description: "Straightforward guides to reward apps, flexible side hustles, smarter budgets, and remote work.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website", siteName: "EarnPouch", url: "https://www.earnpouch.com",
    title: "EarnPouch | Make your money go further",
    description: "Practical, independent guides for earning and managing money with confidence.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: { card: "summary_large_image", title: "EarnPouch | Make your money go further", description: "Practical, independent guides for earning and managing money with confidence.", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ZYFkdRVTFjGCrZi9-hraETJiQGQGy8HWJRqBRYzWbRk" />
      </head>
      <body><Header />{children}<Footer /><AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_ID} /></body>
    </html>
  );
}
