

import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Ribon from "@/components/Ribon";
import { ToastContainer } from "react-toastify";
import { siteConfig } from "./metadata.config";
import { CartProvider } from "@/components/CartContext";
import Script from "next/script";


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

export default function RootLayout({ children }) {
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1270243934469320');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {/* Meta Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1270243934469320&ev=PageView&noscript=1"
            alt="fb-pixel"
          />
        </noscript>
        <SessionProviderWrapper>
          <CartProvider>
            <div className='z-[9999]'>
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
            {children}
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
