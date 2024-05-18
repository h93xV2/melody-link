// app/layout.tsx
import "@aws-amplify/ui-react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MelodyLink",
  description: "Social music sharing app for music producers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}