import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HVACflow - HVAC Management Software for Alberta Contractors',
  description: 'Professional HVAC management software built for 1-5 truck Alberta operations. Real-time GPS tracking, smart scheduling, automatic invoicing, refrigerant tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
