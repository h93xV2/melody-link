"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";

import '@aws-amplify/ui-react/styles.css';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Login({ user }: { user?: AuthUser }) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user]);

  return <></>;
}

function LoginWrapper() {
  return <Authenticator signUpAttributes={[]}>
    {({user}) => {
      return <Login user={user} />
    }}
  </Authenticator>
}

export default LoginWrapper;