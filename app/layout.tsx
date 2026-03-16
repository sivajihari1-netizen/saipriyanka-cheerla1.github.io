import type { Metadata } from 'next';
import { client }         from '@/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saipriyankacheerla.com';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null);
  return {
    title: {
      default: settings?.siteTitle ?? 'Saipriyanka Cheerla — Finance Intelligence',
      template: '%s | Saipriyanka Cheerla',
    },
    description:
      settings?.siteDescription ??
      'Insights on capital markets, financial regulation, and analytical frameworks.',
    openGraph: {
      type:     'website',
      locale:   'en_IN',
      url:      siteUrl,
      siteName: 'Saipriyanka Cheerla',
      images:   settings?.ogImageUrl
        ? [{ url: settings.ogImageUrl, width: 1200, height: 630 }]
        : [],
    },
    twitter: { card: 'summary_large_image' },
    robots:  { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Inconsolata:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
