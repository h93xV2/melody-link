"use client";

import { Tabs } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import NewPost from "./NewPost";
import { Post, getPostsForArtist } from "@/utils/get-posts";
import PostList from "./PostList";

function ProfileTabs(props: {userName: string}) {
  const [tab, setTab] = useState('1');
  const [posts, setPosts] = useState<Post[] | undefined>();

  useEffect(() => {
    getPostsForArtist(props.userName).then((result: Post[]) => {
      result.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPosts(result);
    });
  }, [tab]);

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
          content: <PostList posts={posts} isDeleteVisible={true} />
        }
      ]}
    />
  );
}

export default ProfileTabs;