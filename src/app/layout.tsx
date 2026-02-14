import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

const dosVga = localFont({
  src: [
    {
      path: '../../public/fonts/PerfectDOSVGA437Win.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PerfectDOSVGA437Win.woff',
      weight: 'normal',
      style: 'normal',
    },
  ],
  variable: '--font-dos-vga',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Zara Akhtar React Native Developer",
  description: "React Native Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dosVga.variable} ${pixelifySans.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
