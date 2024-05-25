"use client";

import { Post, getPostsForOwner, getPosts } from "@/utils/get-posts";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";

function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getCurrentUser().then(result => {
      console.log(result.userId);
      getPostsForOwner(result.userId).then(result => {
        console.log(result);
      });
      getPosts("userPool").then(console.log);
    });
  }, []);

  return (
    <></>
  );
}

export default UserPosts;