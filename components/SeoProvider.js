"use client";
import { DefaultSeo } from 'next-seo';
import { siteConfig } from '@/app/metadata.config';

export default function SeoProvider() {
  return (
    <DefaultSeo
      title="century – Premium Online Marketplace"
      description={siteConfig.description}
      canonical={siteConfig.siteUrl}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: siteConfig.siteUrl,
        site_name: 'century',
        title: 'century – Premium Online Marketplace',
        description: siteConfig.openGraphDescription,
        images: [
          {
            url: `${siteConfig.siteUrl}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: 'century Homepage Banner',
          },
        ],
      }}
      twitter={{
        handle: '@century',
        site: '@century',
        cardType: 'summary_large_image',
      }}
      additionalMetaTags={[
        { name: 'keywords', content: siteConfig.keywords.join(', ') },
        { name: 'author', content: siteConfig.author },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffffff' },
      ]}
    />
  );
}
