import "@aws-amplify/ui-react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
import NavBar from "@/components/NavBar";
import { getCurrentAuthUser } from "@/utils/amplify-utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MelodyLink",
  description: "Social music sharing app for music producers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;

  try {
    const currentUser = await getCurrentAuthUser();

    if (currentUser) {
      user = currentUser.user;
    }
  } catch (error) {
    user = undefined;
  }

  return (
    <html lang="en">
      <body className={`${inter.className} container`}>
        <NavBar user={user} />
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}