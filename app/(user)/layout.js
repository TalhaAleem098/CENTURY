import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Ribon from "@/components/Ribon";
import { siteConfig } from "../metadata.config";
import LayoutClient from "../LayoutClient";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Century – Premium Fashion Store",
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: "Century – Premium Fashion Store",
    description: siteConfig.openGraphDescription,
    url: siteConfig.siteUrl,
    siteName: "Century",
    type: "website",
    images: [
      {
        url: `${siteConfig.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Century Homepage Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Century – Premium Fashion Store",
    description: siteConfig.twitterDescription,
    creator: "@century",
    images: [`${siteConfig.siteUrl}/og-image.jpg`],
  },
  metadataBase: new URL(siteConfig.siteUrl),
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function userLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Century",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://facebook.com/century",
      "https://twitter.com/century",
      "https://instagram.com/century",
    ],
  };
  return (
    <>
      <SessionProviderWrapper>
        <Ribon />
        <LayoutClient>
          {children}
        </LayoutClient>
        <Footer/>
      </SessionProviderWrapper>
    </>
  );
}
