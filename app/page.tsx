"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { StorageManager } from "@aws-amplify/ui-react-storage";

import { Amplify } from "aws-amplify";
import { Authenticator, Button, Tabs } from '@aws-amplify/ui-react'
import { fetchUserAttributes } from "aws-amplify/auth";

import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

import outputs from "@/amplify_outputs.json";
import Files from "./files";
import { list } from "aws-amplify/storage";

Amplify.configure(outputs, {
  ssr: true
});

export default function App() {
  const [displayName, setDisplayName] = useState("");
  const [tab, setTab] = useState('1');
  const [audioFiles, setAudioFiles] = useState<string[]>([]);

  fetchUserAttributes().then((attributes) => {
    const preferredUsername = attributes.preferred_username;
    if (preferredUsername) {
      setDisplayName(preferredUsername);
    }
  });
  list({
    path({ identityId }) {
      console.log(identityId);
      return `audio/${identityId}/`
    },
  });

  return (
    <main>
      <h1>Hi {displayName}</h1>
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab)}
        items={[
          {
            label: 'Files',
            value: '1',
            content: (
              <>
                <StorageManager
                  acceptedFileTypes={['audio/*']}
                  path={({ identityId }) => `audio/${identityId}/`}
                  maxFileCount={1}
                  isResumable
                  autoUpload={false}
                />
              </>
            )
          },
          {
            label: 'Posts',
            value: '2',
            content: (
              <>
                <p>Content of the second tab.</p>
                <Button isFullWidth onClick={() => setTab('1')}>
                  Go to first tab
                </Button>
              </>
            ),
          },
        ]}
      />
    </main>
  );
}
