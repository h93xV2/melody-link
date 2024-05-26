"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Howler } from "howler";

export default function Logout() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/login");
        Howler.stop();
      }}
      className="button is-primary"
    >
      Sign out
    </button>
  );
}