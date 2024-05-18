"use client";

import { Tabs } from "@aws-amplify/ui-react";
import { useState } from "react";
import NewPost from "./NewPost";

function ProfileTabs() {
  const [tab, setTab] = useState('1');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      justifyContent={"center"}
      spacing="equal"
      items={[
        {
          label: 'New Post',
          value: '1',
          content: <NewPost />
        }
      ]}
    />
  );
}

export default ProfileTabs;