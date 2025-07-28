import { Metadata } from 'next';
import TermsClient from "./TermsClient";

export const metadata = {
  title: 'Terms and Conditions - Century',
  description: 'Terms and conditions for using Century online store and services.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TermsClient />
      </div>
    </div>
  );
}
