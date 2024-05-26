"use client";

import { Tabs } from "@aws-amplify/ui-react";
import { useState } from "react";
import NewPost from "./NewPost";
import UserPosts from "./UserPosts";

function ProfileTabs(props: {userName: string}) {
  const [tab, setTab] = useState('1');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      justifyContent={"center"}
      spacing="equal"
      items={[
        {
          label: "Create New Post",
          value: '1',
          content: <NewPost userName={props.userName} />
        },
        {
          label: "Your Posts",
          value: "2",
          content: <UserPosts userName={props.userName} />
        }
      ]}
    />
  );
}

export default ProfileTabs;