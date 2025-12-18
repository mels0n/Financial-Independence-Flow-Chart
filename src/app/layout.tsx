import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateDefinedTermSchema } from '@shared/lib/seo/schema';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Financial Independence Flowchart (v4.3)',
  description: 'Interactive guide to personal finance, budgeting, and investing based on the Prime Directive.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = generateDefinedTermSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
