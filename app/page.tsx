"use client";

import { useState } from "react";

import { StorageManager } from "@aws-amplify/ui-react-storage";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react'
import "@aws-amplify/ui-react/styles.css";
import { fetchUserAttributes } from "aws-amplify/auth";

Amplify.configure(outputs);

export default function App() {
  const [displayName, setDisplayName] = useState("");

  return (
    <Authenticator signUpAttributes={['email', 'preferred_username']} >
      {(signOut) => {
        fetchUserAttributes().then((attributes) => {
          const preferredUsername = attributes.preferred_username;
          if (preferredUsername) {
            setDisplayName(preferredUsername);
          }
        });

        return (
          <main>
            <h1>Hi {displayName}</h1>
            <StorageManager
              acceptedFileTypes={['audio/*']}
              path="audio/"
              maxFileCount={1}
              isResumable
            />
          </main>
        )
      }}
    </Authenticator>
  );
}
