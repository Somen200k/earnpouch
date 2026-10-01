import type { Metadata } from "next";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { readSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = readSiteSettings();
  return {
    metadataBase: new URL("https://www.earnpouch.com"),
    title: { default: `${settings.siteName} | ${settings.tagline}`, template: `%s | ${settings.siteName}` },
    description: settings.description,
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      type: "website", siteName: settings.siteName, url: "https://www.earnpouch.com",
      title: `${settings.siteName} | ${settings.tagline}`,
      description: settings.description,
      images: [{ url: "/opengraph-image" }],
    },
    twitter: { card: "summary_large_image", title: `${settings.siteName} | ${settings.tagline}`, description: settings.description, images: ["/opengraph-image"] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ZYFkdRVTFjGCrZi9-hraETJiQGQGy8HWJRqBRYzWbRk" />
        <meta name="monetag" content="4c69dd311f7354ef3ab0ed93995af01b" />
      </head>
      <body><Header />{children}<Footer /><AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_ID} /></body>
    </html>
  );
}
