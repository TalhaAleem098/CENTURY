// This file ensures the dynamic route works for product detail pages in Next.js App Router
export const dynamic = 'force-static';
export async function generateStaticParams() {
  return [];
}
